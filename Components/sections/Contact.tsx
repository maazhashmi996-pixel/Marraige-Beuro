import { Phone, Mail, MapPin } from 'lucide-react';

export default function Contact() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-4xl font-black text-[#4a1111]">Contact Us</h2>
                <div className="w-16 h-1 bg-[#c19206] mx-auto mt-4 mb-16"></div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: <Phone size={32} />, label: "Phone Number", val: "+92 327 7770361" },
                        { icon: <Mail size={32} />, label: "Email Us", val: "Info@sehrishmarriage.com" },
                        { icon: <MapPin size={32} />, label: "Address", val: "2, H Block Sector 2 DHA Rahbar Lahore" }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition group border border-gray-100">
                            <div className="w-16 h-16 border-2 border-[#c19206] border-dashed rounded-full flex items-center justify-center mx-auto mb-6 text-[#c19206] group-hover:bg-[#c19206] group-hover:text-white transition-colors">
                                {item.icon}
                            </div>
                            <h4 className="text-xl font-bold text-gray-800">{item.label}</h4>
                            <p className="text-gray-500 mt-2">{item.val}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}