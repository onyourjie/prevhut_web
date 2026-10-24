import { useEffect, useRef } from "react";
import L from "leaflet";
import { MapPin } from "lucide-react";

interface DraggableMiniMapProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
  className?: string;
  zoom?: number;
  /** Teks petunjuk di atas peta */
  title?: string;
}

const KALIMANTAN_QUICK_PRESETS = [
  { label: "Sintang (Kalbar)", lat: -0.1255, lng: 111.4822 },
  { label: "Pontianak", lat: -0.0263, lng: 109.3425 },
  { label: "Palangka Raya (Kalteng)", lat: -2.2161, lng: 113.9139 },
  { label: "Banjarmasin (Kalsel)", lat: -3.3194, lng: 114.5908 },
  { label: "Balikpapan (Kaltim)", lat: -1.2654, lng: 116.8312 },
  { label: "Tarakan (Kaltara)", lat: 3.327, lng: 117.5965 },
];

export function DraggableMiniMap({
  latitude,
  longitude,
  onChange,
  className = "",
  zoom = 12,
  title = "Geser pin atau klik peta untuk menandai lokasi",
}: DraggableMiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Selalu pakai onChange terbaru agar handler Leaflet tidak memakai closure lama
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [latitude, longitude],
      zoom: zoom,
      scrollWheelZoom: false,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(map);

    // Custom Draggable Flame Pin
    const flamePinIcon = L.divIcon({
      className: "firezone-flame-marker",
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: grab; transform: translate(-50%, -100%);">
          <div style="background: linear-gradient(135deg, #ef4444 0%, #ea580c 100%); width: 38px; height: 38px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(234,88,12,0.6); border: 2.5px solid #ffffff;">
            <svg style="transform: rotate(45deg); width: 20px; height: 20px; color: white;" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 23c-4.97 0-9-4.03-9-9 0-4.66 4.31-9.45 7.42-12.38.83-.78 2.33-.78 3.16 0C16.69 4.55 21 9.34 21 14c0 4.97-4.03 9-9 9zm0-18.78C9.5 7.02 5 11.26 5 14c0 3.87 3.13 7 7 7s7-3.13 7-7c0-2.74-4.5-6.98-7-9.78zm0 13.78c-1.66 0-3-1.34-3-3 0-1.74 1.83-3.67 3-4.8 1.17 1.13 3 3.06 3 4.8 0 1.66-1.34 3-3 3z"/>
            </svg>
          </div>
          <div style="width: 14px; height: 5px; background: rgba(0,0,0,0.35); border-radius: 50%; margin-top: 3px; filter: blur(1px);"></div>
        </div>
      `,
      iconSize: [38, 44],
      iconAnchor: [19, 44],
    });

    const marker = L.marker([latitude, longitude], {
      icon: flamePinIcon,
      draggable: true,
      autoPan: true,
    }).addTo(map);

    // On Drag Marker
    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      onChangeRef.current(Number(pos.lat.toFixed(5)), Number(pos.lng.toFixed(5)));
    });

    // On Click Map to move marker
    map.on("click", (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      onChangeRef.current(Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5)));
    });

    mapRef.current = map;
    markerRef.current = marker;

    // Trigger resize after small delay to ensure full render
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Update marker position when latitude or longitude changes externally
  useEffect(() => {
    if (markerRef.current && mapRef.current) {
      const curPos = markerRef.current.getLatLng();
      if (
        Math.abs(curPos.lat - latitude) > 0.0001 ||
        Math.abs(curPos.lng - longitude) > 0.0001
      ) {
        markerRef.current.setLatLng([latitude, longitude]);
        mapRef.current.panTo([latitude, longitude], { animate: true });
      }
    }
  }, [latitude, longitude]);

  const handleSelectPreset = (lat: number, lng: number) => {
    onChangeRef.current(lat, lng);
    if (mapRef.current && markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      mapRef.current.setView([lat, lng], 12, { animate: true });
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Map Header Instructions */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-neutral-800 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-brand-600" />
          <span>{title}</span>
        </span>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
          {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </span>
      </div>

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-300 shadow-xs">
        <div
          ref={containerRef}
          className="w-full h-64 bg-neutral-100 z-10"
          style={{ minHeight: "250px" }}
        />

        </div>

      {/* Quick Jump Buttons */}
      <div>
        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
          Pintas Wilayah Kalimantan:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {KALIMANTAN_QUICK_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleSelectPreset(preset.lat, preset.lng)}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 border border-neutral-200 text-neutral-700 transition"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
