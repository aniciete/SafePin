import { supabase } from '../config/supabase.js';
import { MapController } from '../components/map.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('report-form');
    const imageInput = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const imageError = document.getElementById('image-error');
    const locationError = document.getElementById('location-error');
    const submitButton = document.getElementById('submit-report');
    const submissionFeedback = document.getElementById('submission-feedback');

    let mapController;

    /**
     * Initializes the Google Map and sets up its listeners.
     */
    async function initializeMap() {
        try {
            mapController = new MapController('map');
            const map = await mapController.initMap({
                center: { lat: 14.5995, lng: 121.0364 }, // Default to Metro Manila
                zoom: 12,
                mapId: 'YOUR_MAP_ID_HERE' // Consider moving to env variable if specific
            });

            const marker = mapController.addMarker({
                map,
                position: map.getCenter(),
                gmpDraggable: true,
                title: 'Drag to set incident location',
            });

            updateLocationFields(map.getCenter());

            map.addListener('click', (e) => {
                marker.position = e.latLng;
                updateLocationFields(e.latLng);
            });

            marker.addListener('dragend', () => {
                updateLocationFields(marker.position);
            });

            document.getElementById('current-location-btn').addEventListener('click', handleCurrentLocation);

        } catch (error) {
            console.error('Error initializing map:', error);
            locationError.textContent = 'Map failed to load. Please refresh the page.';
            locationError.style.display = 'block';
        }
    }

    /**
     * Handles the 'Use Current Location' button click.
     */
    function handleCurrentLocation() {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                mapController.getMap().setCenter(newPos);
                mapController.markers[0].position = newPos;
                updateLocationFields(newPos);
            },
            () => {
                alert('Could not retrieve your location. Please enable location services.');
            }
        );
    }

    /**
     * Updates the hidden latitude and longitude input fields and the address display.
     * @param {google.maps.LatLng} position - The new map position.
     */
    function updateLocationFields(position) {
        const lat = typeof position.lat === 'function' ? position.lat() : position.lat;
        const lng = typeof position.lng === 'function' ? position.lng() : position.lng;

        document.getElementById('latitude').value = lat;
        document.getElementById('longitude').value = lng;
        document.getElementById('address-display').textContent = `Location Selected: Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
        
        // Clear any previous location error
        locationError.textContent = '';
        locationError.style.display = 'none';
    }

    /**
     * Handles image selection, validation, and preview.
     */
    function handleImageChange() {
        const file = imageInput.files[0];
        imageError.textContent = '';
        imageError.style.display = 'none';

        if (!file) {
            imagePreview.classList.add('hidden');
            imagePreview.src = '';
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            imageError.textContent = 'Invalid file type. Please select an image.';
            imageError.style.display = 'block';
            imageInput.value = ''; // Clear the selection
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            imageError.textContent = 'File is too large. Maximum size is 5MB.';
            imageError.style.display = 'block';
            imageInput.value = ''; // Clear the selection
            return;
        }

        // Display preview
        imagePreview.src = URL.createObjectURL(file);
        imagePreview.classList.remove('hidden');
    }

    /**
     * Handles the main form submission.
     * @param {Event} e - The form submission event.
     */
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true, 'Submitting...');

        const formData = new FormData(form);
        const imageFile = formData.get('image');
        const latitude = formData.get('latitude');

        // Final validation check
        if (!latitude || !imageFile || imageFile.size === 0) {
            if (!latitude) {
                locationError.textContent = 'Please select a location on the map.';
                locationError.style.display = 'block';
            }
            if (!imageFile || imageFile.size === 0) {
                imageError.textContent = 'Please select an image to upload.';
                imageError.style.display = 'block';
            }
            setLoading(false, 'Submit Report');
            return;
        }

        try {
            // 1. Upload Image to Supabase Storage
            const filePath = `incidents/${Date.now()}-${imageFile.name}`;
            const { error: uploadError } = await supabase.storage
                .from('reports') // Make sure 'reports' is the correct bucket name
                .upload(filePath, imageFile);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: urlData } = supabase.storage.from('reports').getPublicUrl(filePath);
            if (!urlData || !urlData.publicUrl) throw new Error('Could not get public URL for the image.');

            // 3. Insert Incident Data into Supabase Table
            const incidentData = {
                incident_type: formData.get('incidentType'),
                severity: formData.get('severity'),
                description: formData.get('description'),
                location: {
                    type: 'Point',
                    coordinates: [parseFloat(formData.get('longitude')), parseFloat(formData.get('latitude'))]
                },
                image_path: urlData.publicUrl, // Store the public URL
            };

            const { error: insertError } = await supabase.from('reports').insert(incidentData);

            if (insertError) throw insertError;

            // Success
            showFeedback('Report submitted successfully!', 'success');
            resetForm();
            setTimeout(() => showFeedback('', ''), 5000);

        } catch (error) {
            console.error('Submission Error:', error);
            showFeedback(`Error: ${error.message}`, 'error');
        } finally {
            setLoading(false, 'Submit Report');
        }
    }
    
    /**
     * Resets the form to its initial state.
     */
    function resetForm() {
        form.reset();
        imagePreview.classList.add('hidden');
        imagePreview.src = '';
        // Optionally, reset map to its initial state
        const initialCenter = { lat: 14.5995, lng: 121.0364 };
        mapController.getMap().setCenter(initialCenter);
        mapController.markers[0].position = initialCenter;
        updateLocationFields(initialCenter);
    }

    /**
     * Sets the loading state of the submit button.
     * @param {boolean} isLoading - Whether the form is currently loading.
     * @param {string} message - The message to display on the button.
     */
    function setLoading(isLoading, message) {
        submitButton.disabled = isLoading;
        submitButton.textContent = message;
    }

    /**
     * Displays feedback messages to the user.
     * @param {string} message - The message to display.
     * @param {'success'|'error'} type - The type of message.
     */
    function showFeedback(message, type) {
        submissionFeedback.textContent = message;
        submissionFeedback.className = `submission-feedback ${type}`;
    }

    // Attach event listeners
    form.addEventListener('submit', handleSubmit);
    imageInput.addEventListener('change', handleImageChange);

    // Initialize the map
    initializeMap();
});