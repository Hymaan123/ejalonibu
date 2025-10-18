import React, { useEffect, useState, useRef } from 'react';
import { Phone, Mail, MapPin, Clock, Upload, X, DollarSign } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';
import toast from 'react-hot-toast';

const Contact: React.FC = () => {
  // Safe currency context access with fallback
  let currency = 'NGN';
  // Provide a default formatter that returns a string
  let formatPrice: (value: number) => string = (v) => `${v}`;
  try {
    const ctx = useCurrency?.();
    if (ctx) {
      currency = ctx.currency ?? currency;
      if (ctx.formatPrice) {
        formatPrice = ctx.formatPrice;
      }
    }
  } catch {
    // fallback to defaults if context provider isn't mounted
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
    budget: '',
    timeline: '',
    projectTitle: '',
    customerType: 'guest',
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapFallbackRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const geolocMarkerRef = useRef<any>(null);
  const pathSourceIdRef = useRef<string>('user-path');
  const pathCoordsRef = useRef<number[][]>([]);
  const watchIdRef = useRef<number | null>(null);
  const baseLocationRef = useRef({ lng: 7.2333, lat: 8.8833 });
  const businessMarkerRef = useRef<any>(null);
  const addressString = 'Plot No. R14 Kuji layout, kuje area council, FCT. Abuja, Nigeria';
  const [followMe, setFollowMe] = useState(true);
  const [gpsStatus, setGpsStatus] = useState('Locating...');
  const followRef = useRef(true);

  // Prefill data from quote flow if available
  useEffect(() => {
    const quotePrefill = localStorage.getItem('quote_prefill');
    if (quotePrefill) {
      try {
        const data = JSON.parse(quotePrefill);
        setFormData((prev) => ({
          ...prev,
          service: data?.serviceCategory ?? prev.service,
          projectTitle: data?.serviceType ?? prev.projectTitle,
        }));
        localStorage.removeItem('quote_prefill');
        toast.success('Quote form pre-filled with your selected service!');
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  // Sync follow mode ref with state for use in geolocation callback
  useEffect(() => {
    followRef.current = followMe;
  }, [followMe]);

  // Geocode business address to precise coordinates (Nominatim)
  useEffect(() => {
    let aborted = false;

    const tryGeocode = async () => {
      const candidates = [
        addressString,
        'Plot No. R14, Kuji Layout, Kuje Area Council, Abuja, FCT, Nigeria',
        'Kuji Layout, Kuje, Abuja, Nigeria',
      ];

      for (const q of candidates) {
        if (aborted) return;
        try {
          const params = new URLSearchParams({
            format: 'jsonv2',
            q,
            limit: '1',
            addressdetails: '1',
            countrycodes: 'ng',
            viewbox: '6.8,9.4,7.8,8.5',
            bounded: '1',
          });
          const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;
          const r = await fetch(url, { headers: { Accept: 'application/json' } });
          if (!r.ok) continue;
          const data = await r.json();
          if (Array.isArray(data) && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            if (!isNaN(lat) && !isNaN(lon)) {
              baseLocationRef.current = { lng: lon, lat };
              const map = mapRef.current;
              if (map) {
                map.easeTo({ center: [lon, lat], zoom: 17, duration: 800 });
              }
              if (businessMarkerRef.current) {
                businessMarkerRef.current.setLngLat([lon, lat]);
              }
              if (!mapRef.current && mapFallbackRef.current) {
                const bbox = `${lon - 0.005}%2C${lat - 0.005}%2C${lon + 0.005}%2C${lat + 0.005}`;
                mapFallbackRef.current.style.display = 'block';
                mapFallbackRef.current.innerHTML = `<iframe title="map-fallback" width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}"></iframe>`;
              }
              break;
            }
          }
        } catch {
          // continue to next candidate
        }
      }
    };

    tryGeocode();
    return () => { aborted = true; };
  }, []);

  // Initialize MapLibre map
  useEffect(() => {
    let map: any;
    let failTimer: any;

    const showFallback = () => {
      if (!mapFallbackRef.current) return;
      const { lng, lat } = baseLocationRef.current;
      const bbox = `${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}`;
      mapFallbackRef.current.style.display = 'block';
      mapFallbackRef.current.innerHTML = `
        <iframe
          title="map-fallback"
          width="100%"
          height="100%"
          frameborder="0"
          scrolling="no"
          marginheight="0"
          marginwidth="0"
          src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}">
        </iframe>`;
    };

    const init = () => {
      const mgl = (window as any).maplibregl;
      if (!mgl || !mapContainerRef.current) {
        showFallback();
        return;
      }
      if (mapFallbackRef.current) mapFallbackRef.current.style.display = 'none';
      const target = baseLocationRef.current;

      map = new mgl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution:
                '© OpenStreetMap contributors',
            },
          },
          layers: [
            { id: 'osm', type: 'raster', source: 'osm' },
          ],
        },
        center: [target.lng, target.lat],
        zoom: 13,
        pitch: 60,
        bearing: -10,
        antialias: true,
      });
      mapRef.current = map;

      // If style fails to load, fallback
      map.on('error', (e: any) => {
        const hasStyleErr = String(e?.error || '').toLowerCase().includes('style');
        if (hasStyleErr) showFallback();
      });

      // Timeout fallback if nothing rendered after a bit
      failTimer = setTimeout(() => {
        try {
          if (map && (map as any).isStyleLoaded && !(map as any).isStyleLoaded()) {
            showFallback();
          }
        } catch {
          showFallback();
        }
      }, 5000);

      map.addControl(new mgl.NavigationControl(), 'top-right');

      // Business location marker and popup
      businessMarkerRef.current = new mgl.Marker({ color: '#3b82f6' })
        .setLngLat([target.lng, target.lat])
        .setPopup(new mgl.Popup({ offset: 25 }).setText(addressString))
        .addTo(map);

      // Source/layer for live user path
      map.on('load', () => {
        clearTimeout(failTimer);
        const sourceId = pathSourceIdRef.current;
        if (!map.getSource(sourceId)) {
          map.addSource(sourceId, {
            type: 'geojson',
            data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } },
          });
          map.addLayer({
            id: 'user-path-line',
            type: 'line',
            source: sourceId,
            paint: { 'line-color': '#22c55e', 'line-width': 3 },
          });
        }
      });

      // Real-time geolocation tracking
      const startWatch = () => {
        if (!('geolocation' in navigator)) {
          setGpsStatus('Geolocation not supported');
          return;
        }
        setGpsStatus('Listening for GPS...');
        watchIdRef.current = navigator.geolocation.watchPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setGpsStatus('Updated just now');

            const mgl2 = (window as any).maplibregl;
            if (!geolocMarkerRef.current) {
              const el = document.createElement('div');
              el.style.width = '14px';
              el.style.height = '14px';
              el.style.borderRadius = '50%';
              el.style.background = '#22c55e';
              el.style.boxShadow = '0 0 0 6px rgba(34,197,94,0.25)';
              geolocMarkerRef.current = new mgl2.Marker({ element: el })
                .setLngLat([longitude, latitude])
                .addTo(map);
            } else {
              geolocMarkerRef.current.setLngLat([longitude, latitude]);
            }

            // Update user path
            pathCoordsRef.current.push([longitude, latitude]);
            const src: any = map.getSource(pathSourceIdRef.current);
            if (src && src.setData) {
              src.setData({
                type: 'Feature',
                geometry: { type: 'LineString', coordinates: pathCoordsRef.current },
              });
            }

            // Follow user if enabled
            if (followRef.current) {
              map.easeTo({
                center: [longitude, latitude],
                zoom: Math.max(map.getZoom(), 14),
                duration: 1000,
              });
            }
          },
          (err) => {
            if (err.code === err.PERMISSION_DENIED) {
              setGpsStatus('Location permission denied');
            } else {
              setGpsStatus('GPS error');
            }
          },
          { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
        );
      };

      startWatch();
    };

    if ((window as any).maplibregl) {
      init();
    } else {
      // If MapLibre not present for some reason, fallback
      showFallback();
    }

    return () => {
      clearTimeout(failTimer);
      if (watchIdRef.current != null) {
        try { navigator.geolocation.clearWatch(watchIdRef.current); } catch {}
      }
      if (map) map.remove();
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedExt = /\.(jpg|jpeg|png|pdf|doc|docx|dwg|dxf)$/i;
    const allowedTypes = new Set([
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]);

    const validFiles = files.filter((file) => {
      const extOk = allowedExt.test(file.name);
      const typeOk = allowedTypes.has(file.type);
      if (!typeOk && !extOk) {
        toast.error(`${file.name}: Invalid file type. Allowed: images, PDFs, docs, DWG/DXF.`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name}: File too large. Max 5MB.`);
        return false;
      }
      return true;
    });

    if (attachments.length + validFiles.length > 5) {
      toast.error('Maximum 5 files allowed.');
      return;
    }

    setAttachments((prev) => [...prev, ...validFiles]);

    // Clear input so same file can be reselected later
    if (e.target) (e.target as HTMLInputElement).value = '';
  };

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.service || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();

      // Basic form data
      submitData.append('customerType', formData.customerType);
      submitData.append('serviceCategory', formData.service);
      submitData.append('serviceType', formData.projectTitle || formData.service);

      // Customer info
      submitData.append('guestInfo[name]', formData.name);
      submitData.append('guestInfo[email]', formData.email);
      submitData.append('guestInfo[phone]', formData.phone);
      submitData.append('guestInfo[company]', formData.company);

      // Project details
      submitData.append('projectDetails[title]', formData.projectTitle || `${formData.service} Project`);
      submitData.append('projectDetails[description]', formData.message);

      // Optional fields
      if (formData.budget) {
        submitData.append('estimatedBudget', formData.budget);
        submitData.append('currency', currency);
      }
      if (formData.timeline) {
        submitData.append('timeline', formData.timeline);
      }

      // Attachments
      attachments.forEach((file) => submitData.append('attachments[]', file));

      // Simulate API call (replace with actual API endpoint when available)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('Quote request submitted successfully! We will contact you soon.');

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        message: '',
        budget: '',
        timeline: '',
        projectTitle: '',
        customerType: 'guest',
      });
      setAttachments([]);
    } catch {
      toast.error('Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Phone, title: 'Phone', details: ['+234 80 3786 1879', '+234 80 5546 0603', '+234 80 2450 9293'] },
    { icon: Mail, title: 'Email', details: ['ejaoladimejimetalswork@gmail.com'] },
    { icon: MapPin, title: 'Address', details: ['Plot No. R14 Kuji layout, kuje area council, FCT. Abuja.', 'Abuja, Nigeria'] },
    { icon: Clock, title: 'Working Hours', details: ['Mon - Fri: 8:00 AM - 6:00 PM', 'Sat: 9:00 AM - 5:00 PM'] },
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-black via-gray-900 to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Get In Touch</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Ready to start your metal construction project? Contact us today for a free consultation and quote
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">Get Free Quote</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-2">
                    Service Needed *
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-white"
                  >
                    <option value="">Select a service</option>
                    <option value="metal-construction">Metal Construction Works</option>
                    <option value="wrought-iron">Wrought Iron Work</option>
                    <option value="aluminum-works">Aluminum Works</option>
                    <option value="security-fence">Security Fence Systems</option>
                    <option value="heavy-duty-gates">Heavy Duty Gates & Doors</option>
                    <option value="car-park-installation">Car Park Installation</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="projectTitle" className="block text-sm font-medium text-gray-300 mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  id="projectTitle"
                  name="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-white placeholder-gray-400"
                  placeholder="e.g., Office Building Metal Framework"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">
                    Estimated Budget ({currency})
                  </label>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-white placeholder-gray-400"
                    placeholder="Enter your budget"
                  />
                </div>
                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-gray-300 mb-2">
                    Project Timeline
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-white"
                  >
                    <option value="">Select timeline</option>
                    <option value="asap">ASAP (Rush job)</option>
                    <option value="1-2-weeks">1-2 weeks</option>
                    <option value="1-month">Within 1 month</option>
                    <option value="2-3-months">2-3 months</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Project Details *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-white placeholder-gray-400"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>

              {/* File Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Attachments (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.dwg,.dxf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center space-y-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-gray-300">Click to upload files</span>
                    <span className="text-xs text-gray-400">Images, PDFs, Documents, CAD files (Max 5MB each)</span>
                  </label>
                </div>

                {/* File List */}
                {attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Upload className="h-4 w-4 text-blue-400" />
                          <span className="text-sm text-gray-300">{file.name}</span>
                          <span className="text-xs text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 group"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting Quote Request...</span>
                  </>
                ) : (
                  <>
                    <DollarSign className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>Request Free Quote</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-400">
                  By submitting this form, you agree to be contacted by our team regarding your project.
                </p>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>

            {contactInfo.map((info, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="bg-blue-600/20 p-3 rounded-lg border border-blue-500/30">
                  <info.icon className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">{info.title}</h4>
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-gray-300 mb-1">{detail}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* Real-time Map with live GPS tracking */}
            <div className="relative h-64 rounded-xl border border-gray-700 overflow-hidden">
              <div ref={mapContainerRef} className="absolute inset-0" />
              <div ref={mapFallbackRef} className="absolute inset-0" />
              <div className="absolute top-3 left-3 z-10 flex gap-2">
                <button
                  type="button"
                  onClick={() => setFollowMe((v) => !v)}
                  className={`px-3 py-1 rounded text-xs font-medium ${followMe ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-200'}`}
                >
                  {followMe ? 'Following' : 'Free look'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const map = mapRef.current;
                    if (map) {
                      const base = baseLocationRef.current;
                      map.easeTo({ center: [base.lng, base.lat], zoom: 13, pitch: 60, bearing: -10, duration: 800 });
                    }
                  }}
                  className="px-3 py-1 rounded text-xs font-medium bg-blue-600 text-white"
                >
                  Recenter
                </button>
              </div>
              <div className="absolute bottom-3 left-3 z-10 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {gpsStatus}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
