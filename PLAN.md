# SafePin Crime Reporting Web App Improvement Plan

## Objective

The primary objective is to enhance the `report.html` page and its associated JavaScript files within the SafePin crime reporting web application. This improvement focuses on three core functionalities: robust incident submission, seamless Google Maps integration for location selection, and reliable data/image submission to a Supabase backend. This project is a student demo, so authentication verification for authorities is not required.

## Current State Analysis

Based on the initial review of the provided files:

*   **`src/landing-page/report.html`**: Contains the basic structure for the incident reporting form, including fields for incident type, severity, location (with a map area), description, and image upload. It imports `Header.js` and `Footer.js` as modules and links `report.js` as a module.
*   **`src/landing-page/report.js`**: Handles the initialization of the header, footer, and map. It includes basic map functionality (center, marker, click listener, dragend listener, current location button) and updates a hidden `location` field. It also imports `FormController` but its usage for submission is not fully clear from this file alone. It contains placeholder functions for `clearValidationMessages`, `clearImageUpload`, `showModal`, `resetForm`, and `showErrorModal`.
*   **`src/config/supabase.js`**: Initializes the Supabase client with hardcoded `supabaseUrl` and `supabaseAnonKey`.
*   **`src/components/map.js`**: Manages Google Maps initialization and marker functionality. It currently hardcodes the Google Maps API key.
*   **`supabase/schema.sql`**: Defines the database schema, including the `reports` table with columns like `latitude`, `longitude` (within a `location` JSONB field), `incident_type`, `severity`, `description`, `image_path`, and `created_at` (which defaults to `now()`).

## Clarifications and Decisions

Based on the follow-up questions, the following decisions have been made:

1.  **Google Maps API Key:** The Google Maps API key will be moved to an environment variable for better security and consistency with Supabase keys.
2.  **Form Submission Logic:** All primary form submission logic will be integrated directly into `src/landing-page/report.js`. The `FormController` import and instantiation will be removed.
3.  **Timestamp Generation:** The application will rely solely on Supabase's `created_at TIMESTAMPTZ DEFAULT now()` for timestamp generation, eliminating the need for client-side timestamp generation.

## Detailed Plan

### Phase 1: Environment Variable Setup

**Goal:** Securely manage API keys and Supabase credentials by moving them to environment variables.

**Steps:**

1.  **Update `src/config/supabase.js`**:
    *   Modify this file to retrieve `supabaseUrl` and `supabaseAnonKey` from environment variables (e.g., `process.env.SUPABASE_URL`, `process.env.SUPABASE_ANON_KEY`).
    *   This will likely involve a build-time configuration or a mechanism to inject these variables into the client-side bundle, depending on the Netlify setup. For a client-side application, these would typically be exposed via a build process (e.g., Vite's `import.meta.env`).
    *   **Example (conceptual, actual implementation depends on build tool):**
        ```javascript
        // src/config/supabase.js
        import { createClient } from '@supabase/supabase-js';

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; // Or process.env.SUPABASE_URL
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY; // Or process.env.SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error('Supabase URL or Anon Key is not defined in environment variables.');
            // Potentially throw an error or handle gracefully
        }

        export const supabase = createClient(supabaseUrl, supabaseAnonKey);
        ```
2.  **Update `src/components/map.js`**:
    *   Modify this file to retrieve the Google Maps API key from an environment variable (e.g., `process.env.VITE_GOOGLE_MAPS_API_KEY`).
    *   **Example (conceptual, actual implementation depends on build tool):**
        ```javascript
        // src/components/map.js
        import { Loader } from '@googlemaps/js-api-loader';

        const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // Or process.env.GOOGLE_MAPS_API_KEY

        if (!API_KEY) {
            console.error('Google Maps API Key is not defined in environment variables.');
            // Potentially throw an error or handle gracefully
        }

        const loader = new Loader({
            apiKey: API_KEY,
            version: 'weekly',
            libraries: ['marker'],
        });
        // ... rest of the MapController class
        ```

### Phase 2: HTML Form Refinement

**Goal:** Enhance the `report.html` form to include necessary hidden fields for location data and elements for user feedback.

**Steps:**

1.  **Add Hidden Input Fields for Latitude and Longitude**:
    *   Inside the `form-group` with `data-field="location"` in `src/landing-page/report.html`, add two new hidden input fields for `latitude` and `longitude`. These will be directly populated by map interactions.
    *   **Example:**
        ```html
        <!-- src/landing-page/report.html -->
        <div class="form-group" data-field="location">
            <label for="location">Location <span class="required">*</span></label>
            <div class="map-area">
                <div class="map-address-bar">
                    <span id="address-display">Select a location on the map</span>
                </div>
                <div id="map" role="application" aria-label="Interactive map to select incident location"></div>
                <button type="button" id="current-location-btn" class="current-location-btn" aria-label="Use current location">
                    <img src="../assets/Current Location Image.svg" alt="Current Location" class="location-icon">
                    Use Current Location
                </button>
            </div>
            <!-- New hidden fields for lat/lng -->
            <input type="hidden" id="latitude" name="latitude" aria-describedby="latitude-error">
            <input type="hidden" id="longitude" name="longitude" aria-describedby="longitude-error">
            <div id="location-error" class="validation-feedback"></div>
        </div>
        ```
2.  **Ensure Elements for Loading/Success/Failure Messages**:
    *   Add a dedicated area in `report.html` to display submission status messages (loading, success, error). This could be a `div` that is dynamically updated.
    *   **Example:**
        ```html
        <!-- src/landing-page/report.html (after the form, before footer) -->
        <div id="submission-feedback" class="submission-feedback" aria-live="polite"></div>
        ```
    *   Modify the submit button to include a loading state (e.g., `disabled` attribute, text change).

### Phase 3: Google Maps Integration Logic

**Goal:** Implement interactive map features to allow users to easily select and refine incident locations.

**Steps:**

1.  **Modify `src/landing-page/report.js` to handle map interactions**:
    *   **Implement map click listener**: The existing `map.addListener('click', ...)` will be updated to move the marker and call `updateLocationField` with the new `latLng`.
    *   **Implement marker dragend listener**: The existing `marker.addListener('dragend', ...)` will be updated to call `updateLocationField` with the marker's new position.
    *   **Ensure current location button correctly updates map center and marker position**: The `handleCurrentLocation` function already does this, but ensure it also calls `updateLocationField` to populate the new hidden fields.
    *   **Update `updateLocationField` to populate the new hidden lat/lng fields**:
        *   This function will now target the new `latitude` and `longitude` hidden input fields instead of a single `location` field.
        *   **Example:**
            ```javascript
            // src/landing-page/report.js
            function updateLocationField(position) {
                const latitudeField = document.getElementById('latitude');
                const longitudeField = document.getElementById('longitude');
                const addressDisplay = document.getElementById('address-display'); // Assuming this exists for user feedback

                if (latitudeField && longitudeField) {
                    const lat = typeof position.lat === 'function' ? position.lat() : position.lat;
                    const lng = typeof position.lng === 'function' ? position.lng() : position.lng;

                    latitudeField.value = lat;
                    longitudeField.value = lng;

                    // Optional: Reverse geocode to display human-readable address
                    // This would require an additional Google Maps API service (Geocoder)
                    // For now, just display lat/lng or a generic message
                    if (addressDisplay) {
                        addressDisplay.textContent = `Location: Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`;
                    }
                    console.log('Location fields updated:', { lat, lng });
                }
            }
            ```

### Phase 4: Image Upload and Preview

**Goal:** Enable image selection, client-side validation, and display a preview before submission.

**Steps:**

1.  **Implement image file input change listener in `src/landing-page/report.js`**:
    *   Get a reference to the `image-upload` input and `image-preview` img elements.
    *   Add an `eventListener` for the `change` event on the `image-upload` input.
    *   Inside the listener:
        *   Check if a file is selected.
        *   **Validate image type**: Ensure `file.type.startsWith('image/')`.
        *   **Validate image size**: Check `file.size` against a maximum (e.g., 5MB = 5 \* 1024 \* 1024 bytes).
        *   **Display a preview**: If valid, use `URL.createObjectURL(file)` to create a URL for the image and set it as the `src` of `image-preview`. Remove the `hidden` class.
        *   **Show validation feedback for invalid files**: If validation fails, clear the input, hide the preview, and display an error message in the `image-error` validation feedback div.

### Phase 5: Supabase Data Submission

**Goal:** Implement the core logic for uploading images to Supabase Storage and inserting incident data into the `reports` table.

**Steps:**

1.  **Integrate Supabase client in `src/landing-page/report.js`**:
    *   Ensure `supabase` is imported from `src/config/supabase.js`.
    *   **Example:** `import { supabase } from '../config/supabase.js';`
2.  **Implement form submission handler in `src/landing-page/report.js`**:
    *   Get a reference to the `report-form` and add an `eventListener` for the `submit` event.
    *   Prevent default form submission (`event.preventDefault()`).
    *   **Show loading indicator**: Disable the submit button and change its text (e.g., "Submitting..."). Display the general submission feedback message.
    *   **Collect form data**: Gather values from `incidentType`, `severity`, `latitude`, `longitude`, `description`, and the image file. Perform final client-side validation.
    *   **Upload image to Supabase Storage**:
        *   Generate a unique path for the image (e.g., `incidents/${Date.now()}-${file.name}`).
        *   Use `supabase.storage.from('e_name').upload(path, file, { cacheControl: '3600', upsert: false })`. You'll need to determine the correct bucket name (e.g., 'incidents').
        *   Handle potential upload errors.
    *   **Retrieve the public URL of the uploaded image**:
        *   If the upload is successful, use `supabase.storage.from('bucket_name').getPublicUrl(path)`.
        *   Extract the `publicUrl` from the response.
    *   **Insert incident data into the `reports` table**:
        *   Construct the incident object:
            ```javascript
            const incidentData = {
                location: {
                    latitude: parseFloat(latitudeField.value),
                    longitude: parseFloat(longitudeField.value)
                },
                incident_type: incidentTypeField.value,
                severity: severityField.value,
                description: descriptionField.value,
                image_path: publicUrl // Use image_path as per schema.sql
            };
            ```
        *   Use `supabase.from('reports').insert([incidentData])`.
        *   Handle potential insertion errors.
    *   **Handle success**:
        *   Show a success message in the `submission-feedback` area.
        *   Call `resetForm()` to clear the form.
    *   **Handle failure**:
        *   Show an error message in the `submission-feedback` area.
        *   Log the error to the console for debugging.
    *   **Hide loading indicator**: Re-enable the submit button and restore its original text.

### Phase 6: Error Handling and UI Feedback

**Goal:** Provide a robust and user-friendly experience by handling errors gracefully and giving clear feedback.

**Steps:**

1.  **Implement robust error handling**:
    *   Wrap all asynchronous operations (map initialization, geolocation, image upload, Supabase insert) in `try...catch` blocks.
    *   Utilize the `UploadError`, `FormError`, `MapError` from `../utils/errorHandler.js` if they are suitable, or create custom error handling logic.
2.  **Display user-friendly success and error messages**:
    *   Use the `submission-feedback` element to display messages.
    *   Style these messages appropriately (e.g., green for success, red for error).
3.  **Manage loading states**:
    *   Ensure the submit button is disabled and visually indicates loading during submission.
    *   Consider a global loading overlay for longer operations if necessary.

### Phase 7: Code Cleanup and Modularity

**Goal:** Ensure the codebase remains clean, maintainable, and adheres to modular principles.

**Steps:**

1.  **Remove `FormController` import and related instantiation**:
    *   Delete `import { FormController } from './form.controller.js';` from `src/landing-page/report.js`.
    *   Remove `new FormController();` instantiation.
2.  **Ensure all new logic adheres to modular principles**:
    *   Keep functions focused on single responsibilities.
    *   If `src/landing-page/report.js` becomes too large, consider extracting specific functionalities (e.g., image handling, Supabase interactions) into new, dedicated utility modules (e.g., `src/utils/imageHandler.js`, `src/services/incidentService.js`).

## Workflow Diagram

```mermaid
graph TD
    A[User opens report.html] --> B{Initialize Page};
    B --> C[Load Header/Footer];
    B --> D[Initialize Google Map];
    D --> E[Map Click/Drag Marker];
    E --> F[Update Lat/Lng Fields];
    F --> G[User Fills Form];
    G --> H[User Selects Image];
    H --> I{Image Validation};
    I -- Valid --> J[Display Image Preview];
    I -- Invalid --> K[Show Image Error];
    G --> L[User Clicks Submit];
    L --> M[Show Loading Indicator];
    M --> N{Upload Image to Supabase Storage};
    N -- Success --> O[Get Public Image URL];
    O --> P{Insert Incident Data to Supabase Postgres};
    P -- Success --> Q[Show Success Message];
    Q --> R[Reset Form];
    P -- Failure --> S[Show Error Message];
    N -- Failure --> S;
    S --> T[Log Error];