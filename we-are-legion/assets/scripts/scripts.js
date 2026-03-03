function initMap() 
{

   /** 
   * Create array of locations
   */
   const markers = [
      {
         locationName: 'Crumbs & Dollies',
         lat: 51.512222624233566,
         lng: -0.13840734189018739,
         address: '1 Kingly Ct,<br> Carnaby,<br> London,<br> W1B 5PA'
      },
      {
         locationName: 'Rinkoff Bakery',
         lat: 51.52026231452749,
         lng: -0.052815725337595015,
         address: '222-226 Jubilee St,<br> London,<br> E1 3BS'
      },
      {
         locationName: 'Comptoir Gourmand Bermondsey',
         lat: 51.500874447971604,
         lng: -0.0819699,
         address: '96 Bermondsey St,<br> London,<br> SE1 3UB'
      },
      {
         locationName: 'Bageriet',
         lat: 51.51195028807007,
         lng: -0.12619283058494118,
         address: '24 Rose St,<br> London,<br> WC2E 9EA'
      },
      {
         locationName: 'Ole & Steen',
         lat: 51.50635804760832,
         lng: -0.017434353136203003,
         address: 'CR34 Crossrail Pl,<br> London,<br> E14 5AR'
      }
   ];

   /** 
   * Create custom marker icon
   */
   const fehMarker = 'https://www.frontendhero.dev/wp-content/uploads/2023/03/feh-marker.png';

   /** 
   * Initially center map on London, UK
   */
   const centerMap = {lat: 26.2883539, lng: -8.8772164 }

   /** 
   * Create map options for our map
   */
   const mapOptions = {
      center: centerMap,
      zoom: 12,
      disableDefaultUI: true,
      styles: [{
            "featureType": "administrative",
            "elementType": "all",
            "stylers": [{
               "visibility": "on"
            }]
         },
         {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{
               "color": "#444444"
            }]
         },
         {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{
               "color": "#f3f3f3"
            }]
         },
         {
            "featureType": "landscape.natural",
            "elementType": "all",
            "stylers": [{
               "color": "#cccccc"
            }]
         },
         {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [{
               "visibility": "off"
            }]
         },
         {
            "featureType": "road",
            "elementType": "all",
            "stylers": [{
                  "saturation": "0"
               },
               {
                  "lightness": "0"
               },
               {
                  "visibility": "simplified"
               }
            ]
         },
         {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [{
                  "weight": "0.49"
               },
               {
                  "visibility": "on"
               },
               {
                  "saturation": "0"
               },
               {
                  "color": "#9a9a9a"
               },
               {
                  "gamma": "1.55"
               },
               {
                  "lightness": "0"
               }
            ]
         },
         {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{
               "color": "#c280a3"
            }]
         },
         {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [{
               "visibility": "off"
            }]
         },
         {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [{
                  "visibility": "off"
               },
               {
                  "color": "#a73636"
               }
            ]
         },
         {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{
                  "color": "#cfd0d0"
               },
               {
                  "visibility": "on"
               }
            ]
         }
      ]

   }

   /** 
   * Add map to div, and include above map options
   */
   const map = new google.maps.Map(document.getElementById("google-map"), mapOptions);

   /** 
   * Create InfoWindow object 
   */
   const infoWindow = new google.maps.InfoWindow({
      minWidth: 200,
      maxWidth: 200
   });

   /** 
   * Create bounds object
   */
   const bounds = new google.maps.LatLngBounds();

   /** 
   * Loop through all markers
   */
   for (let i = 0; i < markers.length; i++) 
   {

      /** 
      * Create new markers
      */
      const marker = new google.maps.Marker({
         position: {
            lat: markers[i]['lat'],
            lng: markers[i]['lng']
         },
         map: map,
         icon: fehMarker,
         animation: google.maps.Animation.DROP
      });

      /** 
      * Function that will create new info windows with info from markers array/objects
      * and click events to open them
      */
      function createInfoWindows() 
      {
         const infoWindowContent = `
            <div class="feh-content">
               <h3>${markers[i]['locationName']}</h3>
               <address>
                  <p>${markers[i]['address']}</p>
               </address>
            <div>
         `;

         google.maps.event.addListener(marker, "click", function() {
            infoWindow.setContent(infoWindowContent);
            infoWindow.open(map, marker);
         });
      }
      createInfoWindows();

      /** 
      * Recenter map when an info window is closed
      */
      infoWindow.addListener('closeclick', function() {
         map.fitBounds(bounds);
      });

      /** 
      * Fit all of our markers on the map, neatly
      */
      bounds.extend(new google.maps.LatLng(markers[i]['lat'], markers[i]['lng']));
      map.fitBounds(bounds);
   }

}