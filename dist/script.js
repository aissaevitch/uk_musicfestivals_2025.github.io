// Mapbox Access Token
mapboxgl.accessToken = "pk.eyJ1IjoiYWlzc2Fldml0Y2giLCJhIjoiY202dGphODBrMDNpaTJpc2hyaWV0YXBhdiJ9.jqL4gbq8uNOpcgfTUZLXsg";

// Create the Map
const map = new mapboxgl.Map({
  container: "map", // container element id
  style: "mapbox://styles/aissaevitch/cm79e4369001301sicypw3jsr", // Your custom style
  center: [-3.4360, 55.3781], // Initial map center
  zoom: 4.5 // Initial zoom level
});

// URL to GeoJSON dataset (this URL should point to a valid GeoJSON file)
const data_url = "https://api.mapbox.com/datasets/v1/aissaevitch/cm7abqoy41hxl1nqullq63u0j/features?access_token=pk.eyJ1IjoiYWlzc2Fldml0Y2giLCJhIjoiY202dGphODBrMDNpaTJpc2hyaWV0YXBhdiJ9.jqL4gbq8uNOpcgfTUZLXsg";

// Wait for the map to load
map.on("load", () => {
  // Filters for the Month and Festival Type
 // Filters for the Festival Type
  let filterType = ["!=", ["get", "Title"], "placeholder"];
  let filterMonth = null; // No filter applied at first (shows all festivals)
  
  
  map.on('click', (event) => { 

  // If the user clicked on one of your markers, get its information. 

  const features = map.queryRenderedFeatures(event.point, { 

    layers: ['festivals'] // replace with your layer name 

  }); 

  if (!features.length) { 

    return; 

  } 

  const feature = features[0]; 

 

  /*  

    Create a popup, specify its options  

    and properties, and add it to the map. 

  */ 

const popup = new mapboxgl.Popup({ offset: [0, -15], className:"my-popup"}) 
.setLngLat(feature.geometry.coordinates) 
.setHTML(`<h3>${feature.properties.Title}</h3><p>Location: ${feature.properties.Location}
<p> Date: ${feature.properties.Date}</p>`)
  .addTo(map); 

}); 


  // Add festival layer to the map using circles (assuming the dataset is in GeoJSON format)
  map.addLayer({
    id: "festivals",
    type: "circle",
    source: {
      type: "geojson",
      data: data_url
    },
    paint: {
      "circle-radius": 3,
      "circle-color": "black",
      "circle-opacity": 1, 
       "circle-stroke-color": "white",  // Add black outline color
  "circle-stroke-width": 3 
      
    }
  });
  
    // Hover
  
  map.on("mousemove", (event) => {
 const dzone = map.queryRenderedFeatures(event.point, {
 layers: ["festivals"]
 });
 document.getElementById("pd").innerHTML = dzone.length
 ? `<h3>${dzone[0].properties.DZName}</h3><p>Rank:
<strong>${dzone[0].properties.Percentv2}</strong> %</p>`
 : `<p>Hover over a data zone!</p>`;
});

  // Set initial filter for the month and festival title
  map.setFilter("festivals", ["all", filterMonth, filterType]);

  // Initialize the display for the month text on page load (e.g., Month: January)
  const monthNames = ["All Festivals","January", "February", "March", "April", "May", "June", "July", "August", "September", "October"];
  document.getElementById("active-month").innerText = monthNames[0]; // Display January initially

  // Slider interaction to change month
  document.getElementById("slider").addEventListener("input", (event) => {
    const month = parseInt(event.target.value); // Get the month number (1 to 10)
    console.log("Slider value (Month):", month); // Debugging
    
    if (month === 1) {
        // "All Festivals" filter (show all festivals)
        filterMonth = null; // Remove the month filter completely
        map.setFilter("festivals", ["all", filterType]); // Apply only the filterType (i.e., Title filter)

        // Update the month label to "All Festivals"
        document.getElementById("active-month").innerText = monthNames[0]; // Display "All Fes

        } else if (month >= 2 && month <= 11) {
      // Format month to "2025-01", "2025-02", etc.
      const formatted_month = "2025-" + ("0" + month).slice(-2); // e.g., "2025-01"
      console.log("Formatted Month:", formatted_month); // Debugging

      // Update the filter for the selected month
      filterMonth = ["==", ["get", "Month"], formatted_month];
      map.setFilter("festivals", ["all", filterMonth, filterType]);

      // Update the UI to show active month name without "Month: "
      document.getElementById("active-month").innerText = monthNames[month - 1]; // Directly show the month name
    }
  });

  // Handle festival type filter via radio buttons
  document.getElementById("filters").addEventListener("change", (event) => {
    const type = event.target.value;
    console.log("Selected Festival Type:", type); // Debugging

    // Apply filters based on selected festival type
    if (type === "all") {
      filterType = ["!=", ["get", "Genre"], "placeholder"];
    } else if (type === "Mixed/Other") {
      filterType = ["==", ["get", "Genre"], "Mixed/Other"];
    } else if (type === "Jazz") {
      filterType = ["==", ["get", "Genre"], "Jazz"];
    } else if (type === "Country/Bluegrass") {
      filterType = ["==", ["get", "Genre"], "Country/Bluegrass"];
    } else if (type === "Folk/Acoustic") {
      filterType = ["==", ["get", "Genre"], "Folk/Acoustic"];
    } else if (type === "Blues/Soul") {
      filterType = ["==", ["get", "Genre"], "Blues/Soul"];
    } else if (type === "Rock/Metal") {
      filterType = ["==", ["get", "Genre"], "Rock/Metal"];
    } else {
      console.log("Error: Invalid festival type.");
    }

    // Apply both month and festival type filters
    map.setFilter("festivals", ["all", filterMonth, filterType]);
  });
 });