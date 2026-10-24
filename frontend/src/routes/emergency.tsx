import { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { PhoneCall, ShieldAlert, RefreshCw } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { apiRequest } from '@/lib/api';

export const Route = createFileRoute('/emergency')({
  component: EmergencyPage,
});

function EmergencyPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [protocol, setProtocol] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cData, pData] = await Promise.all([
          apiRequest('/emergency/contacts'),
          apiRequest('/emergency/protocol'),
        ]);
        setContacts(cData || []);
        setProtocol(pData);
      } catch (err) {
        console.error('Failed to load emergency info:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <AppLayout title="Layanan Darurat" subtitle="Nomor siaga & protokol evakuasi cepat">
      <div className="max-w-xl mx-auto space-y-5 text-left pb-16">
        {/* Emergency Call Banner with guaranteed solid vivid red */}
        <div
          className="p-5 rounded-2xl text-white shadow-lg shadow-red-600/30 border border-red-700"
          style={{ backgroundColor: '#dc2626' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold leading-tight text-white">
                Panggilan Darurat Siaga
              </h2>
              <p className="text-xs text-red-100 font-medium mt-0.5">
                Hubungi langsung instansi terkait untuk respon kilat bebas pulsa
              </p>
            </div>
          </div>
        </div>

        {/* Contacts Grid */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider px-1">
            Nomor Kontak Siaga (Bebas Pulsa)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {isLoading ? (
              <div className="col-span-2 py-8 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-brand-600" />
                <span>Memuat kontak darurat...</span>
              </div>
            ) : (
              contacts.map((contact) => (
                <a
                  key={contact.id || contact.number}
                  href={`tel:${contact.number}`}
                  className="p-4 rounded-2xl bg-white border border-neutral-300 hover:border-red-500 hover:shadow-md transition group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-xs"
                      style={{ backgroundColor: contact.badgeColor || '#dc2626', color: '#ffffff' }}
                    >
                      {contact.number}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-neutral-900 group-hover:text-red-700 transition">
                        {contact.name}
                      </h4>
                      <p className="text-[11px] text-neutral-500 font-medium">{contact.category}</p>
                    </div>
                  </div>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shadow-xs transition group-hover:scale-105"
                    style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
                  >
                    <PhoneCall className="w-4 h-4" />
                  </div>
                </a>
              ))
            )}
          </div>
        </div>

        {/* Evacuation Protocol 5-Steps */}
        {protocol && (
          <div className="bg-white rounded-2xl border border-neutral-300 p-5 space-y-4 shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-orange-600 mb-0.5">
                <ShieldAlert className="w-4 h-4" />
                <span>STANDAR OPERASIONAL KESELAMATAN</span>
              </div>
              <h3 className="text-sm font-extrabold text-neutral-900">{protocol.title}</h3>
              <p className="text-xs text-neutral-500 mt-0.5">{protocol.subtitle}</p>
            </div>

            <div className="space-y-3 pt-1">
              {protocol.steps?.map((step: any) => (
                <div key={step.step} className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div
                    className="w-7 h-7 rounded-full text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs"
                    style={{ backgroundColor: '#eb5314' }}
                  >
                    {step.step}
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="font-bold text-xs text-neutral-900">{step.title}</h5>
                    <p className="text-[11px] text-neutral-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
