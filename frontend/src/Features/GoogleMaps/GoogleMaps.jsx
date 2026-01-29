import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  ButtonGroup,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Chip,
  Rating,
  CircularProgress,
  Alert
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HotelIcon from '@mui/icons-material/Hotel';
import AttractionsIcon from '@mui/icons-material/Attractions';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';


//einkommentieren falls notwendig
//const GOOGLE_MAPS_API_KEY = 'AIzaSyC4hKVIGMMVAQuU_Yt0RwJ89pdAMy5grOQ';
const GOOGLE_MAPS_API_KEY = 'auskommentieren falls notwendig';


function GoogleMaps({ vacations = [] }) {
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  
  const mapRef = useRef(null);
  const serviceRef = useRef(null);

  // Finde den nächsten geplanten Urlaub und setze den Ort
  useEffect(() => {
    if (vacations && vacations.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Filtere zukünftige Urlaube und sortiere nach Startdatum
      const futureVacations = vacations
        .filter(vacation => {
          const startDate = new Date(vacation.startDate);
          return startDate >= today;
        })
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      
      // Setze den Ort des nächsten Urlaubs, falls vorhanden
      if (futureVacations.length > 0 && futureVacations[0].location) {
        setSearchLocation(futureVacations[0].location);
      } else {
        setSearchLocation('');
      }
    } else {
      setSearchLocation('');
    }
  }, [vacations]);

  // Google Maps laden
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (window.google) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => initializeMap();
      script.onerror = () => {
        setError('Fehler beim Laden von Google Maps. Bitte überprüfen Sie Ihren API-Schlüssel.');
      };
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);

  // Standort des Benutzers abrufen
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          if (map) {
            map.setCenter(location);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Fallback: Berlin
          const fallbackLocation = { lat: 52.520008, lng: 13.404954 };
          setUserLocation(fallbackLocation);
          if (map) {
            map.setCenter(fallbackLocation);
          }
        }
      );
    }
  }, [map]);

  const initializeMap = () => {
    if (mapRef.current && window.google) {
      const defaultCenter = userLocation || { lat: 52.520008, lng: 13.404954 }; // Berlin
      
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 13,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "on" }]
          }
        ]
      });

      setMap(newMap);
      serviceRef.current = new window.google.maps.places.PlacesService(newMap);
    }
  };

  const searchPlaces = () => {
    if (!map || !serviceRef.current) {
      setError('Map ist noch nicht geladen. Bitte warten...');
      return;
    }

    setLoading(true);
    setError('');
    setPlaces([]);

    // Wenn ein Ort eingegeben wurde, geokodieren
    if (searchLocation.trim()) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: searchLocation }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          map.setCenter(location);
          performPlacesSearch(location);
        } else {
          setError('Ort nicht gefunden. Bitte versuchen Sie es erneut.');
          setLoading(false);
        }
      });
    } else {
      // Verwende aktuellen Map-Mittelpunkt
      performPlacesSearch(map.getCenter());
    }
  };

  const performPlacesSearch = (location) => {
    if (!searchQuery.trim()) {
      setError('Bitte geben Sie einen Suchbegriff ein.');
      setLoading(false);
      return;
    }

    const request = {
      location: location,
      radius: 5000, // 5km Radius
      query: searchQuery
    };

    serviceRef.current.textSearch(request, (results, status) => {
      setLoading(false);
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        // Nehme die Top 10 Ergebnisse
        const topResults = results.slice(0, 10);
        setPlaces(topResults);
        
        // Marker auf der Karte setzen
        clearMarkers();
        topResults.forEach((place) => {
          new window.google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: place.name
          });
        });
      } else {
        setError('Keine Ergebnisse gefunden.');
      }
    });
  };

  const clearMarkers = () => {
    // Entferne alle Marker (vereinfachte Version)
    // In einer produktiven App sollten Marker-Referenzen gespeichert werden
  };

  const getPlaceIcon = (place) => {
    if (place.types) {
      if (place.types.includes('restaurant') || place.types.includes('food')) {
        return <RestaurantIcon color="primary" />;
      }
      if (place.types.includes('lodging')) {
        return <HotelIcon color="primary" />;
      }
      if (place.types.includes('tourist_attraction') || place.types.includes('point_of_interest')) {
        return <AttractionsIcon color="primary" />;
      }
    }
    return <LocationOnIcon color="primary" />;
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, height: '600px', p: 2 }}>
      {/* Linke Seite: Steuerung und Ergebnisse */}
      <Paper elevation={3} sx={{ width: '400px', p: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
          Orte in der Nähe finden
        </Typography>

        {/* Ort-Eingabe */}
        <TextField
          label="Ort"
          variant="outlined"
          fullWidth
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          placeholder="z.B. Berlin, München, Hamburg"
          sx={{ mb: 2 }}
        />

        {/* Such-Eingabe */}
        <TextField
          label="Was möchten Sie finden?"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="z.B. Restaurant, Hotel, Sehenswürdigkeit, Café, Museum..."
          sx={{ mb: 2 }}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !loading && map && searchQuery.trim()) {
              searchPlaces();
            }
          }}
        />

        {/* Such-Button */}
        <Button
          variant="contained"
          fullWidth
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
          onClick={searchPlaces}
          disabled={loading || !map || !searchQuery.trim()}
          sx={{ mb: 2 }}
        >
          {loading ? 'Suche...' : 'Suchen'}
        </Button>

        {/* Fehler-Anzeige */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Ergebnisliste */}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
            {places.length > 0 && `${places.length} Ergebnisse für "${searchQuery}" gefunden`}
          </Typography>
          <List>
            {places.map((place, index) => (
              <ListItem
                key={index}
                sx={{
                  mb: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    cursor: 'pointer'
                  }
                }}
                onClick={() => {
                  map.setCenter(place.geometry.location);
                  map.setZoom(16);
                }}
              >
                <ListItemIcon>
                  {getPlaceIcon(place)}
                </ListItemIcon>
                <ListItemText
                  primary={place.name}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {place.vicinity}
                      </Typography>
                      {place.rating && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Rating value={place.rating} readOnly size="small" precision={0.1} />
                          <Typography variant="caption">
                            ({place.rating}) • {place.user_ratings_total || 0} Bewertungen
                          </Typography>
                        </Box>
                      )}
                      {place.opening_hours && (
                        <Chip
                          label={place.opening_hours.open_now ? 'Geöffnet' : 'Geschlossen'}
                          color={place.opening_hours.open_now ? 'success' : 'default'}
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>

      {/* Rechte Seite: Karte */}
      <Paper elevation={3} sx={{ flex: 1 }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '4px' }} />
      </Paper>
    </Box>
  );
}

export default GoogleMaps;
