# scripts/create-jurisdictions-json.py
import csv
import json
import os

# --- CONFIGURATION ---
# Define the input and output file paths relative to the script's location.
csv_file_path = os.path.join(os.path.dirname(__file__), 'psgc_data.csv')
output_json_path = os.path.join(os.path.dirname(__file__), 'jurisdictions.json')
# --- END CONFIGURATION ---

def clean_city_name(name):
    """Removes prefixes like 'City of' or 'Municipality of' from a name."""
    name = name.strip()
    if name.startswith('City of '):
        return name[8:] # Length of "City of "
    if name.startswith('Municipality of '):
        return name[16:] # Length of "Municipality of "
    return name

def create_json_from_psgc_list():
    """
    Reads the PSGC CSV data and converts it into a clean jurisdictions.json file.
    """
    print(f"🔵 Reading PSGC data from: {csv_file_path}")
    
    jurisdictions = []
    current_city = None
    
    try:
        with open(csv_file_path, mode='r', encoding='utf-8') as infile:
            reader = csv.reader(infile)
            
            # Skip the header row
            header = next(reader)
            print(f"   CSV Headers found: {header}")
            
            for row in reader:
                # Ensure the row has the expected number of columns
                if len(row) < 3:
                    continue
                
                psgc_code, name, geo_level = row[0].strip(), row[1].strip(), row[2].strip()
                
                # When a "City" or "Mun" (Municipality) row is found,
                # we store its name to use for all subsequent barangays.
                if geo_level in ['City', 'Mun']:
                    current_city = clean_city_name(name)
                    print(f"  -> Processing city/municipality: {current_city}")
                
                # We only want to add barangays ('Bgy') to our final JSON list.
                elif geo_level == 'Bgy':
                    if not current_city:
                        print(f"⚠️ Skipping Barangay '{name}' because a city has not been identified yet.")
                        continue
                    
                    # Create the dictionary object in the required format
                    barangay_entry = {
                        "psgc_code": psgc_code,
                        "barangay": name,
                        "city": current_city
                    }
                    jurisdictions.append(barangay_entry)

        print(f"\n✅ Successfully processed {len(jurisdictions)} barangays.")

        # Write the final list of dictionaries to the new jurisdictions.json file
        with open(output_json_path, 'w', encoding='utf-8') as outfile:
            json.dump(jurisdictions, outfile, indent=2)

        print(f"📄 Success! New 'jurisdictions.json' file created at: {output_json_path}")

    except FileNotFoundError:
        print(f"❌ ERROR: The file was not found at '{csv_file_path}'.")
        print("    Please make sure you've downloaded the CSV and placed it in the 'scripts' folder.")
    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}")

# --- Run the main function ---
create_json_from_psgc_list()