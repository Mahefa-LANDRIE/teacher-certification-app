import React, { useState, useMemo, useEffect } from 'react';
import { Printer, Upload, User, Briefcase, Type, MapPin, DollarSign, PenTool, Mail, Phone, Palette, Calculator, Calendar, Hash, Coins, Download, FileText, Image, Maximize, Scissors } from 'lucide-react';

const App = () => {
  // Ampidirina ny script ilaina rehetra (html2canvas ho an'ny sary, jsPDF ho an'ny PDF)
  useEffect(() => {
    const scripts = [
      "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
    ];
    scripts.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    });
  }, []);

  // State for general school info
  const [schoolInfo, setSchoolInfo] = useState({
    name: "ECOLE PRIMAIRE ET MATERNELLE BILINGUE",
    subName: "LES BASSONS",
    address: "Logpom (fin goudron) Douala 5eme",
    bp: "BP 21097 Douala",
    tel: "233 21 15 49",
    email: "les_bassons@yahoo.fr",
    phones: "699 83 90 93 / 699 95 61 89"
  });

  // State for theme color
  const [themeColor, setThemeColor] = useState("#1e1b4b");

  // State for currency selection
  const [currency, setCurrency] = useState("FCFA");
  const currencies = [
    { label: "FCFA", value: "FCFA" },
    { label: "Ariary (AR)", value: "AR" },
    { label: "Euro (€)", value: "€" },
    { label: "USD ($)", value: "$" },
    { label: "Naira (₦)", value: "₦" },
    { label: "Lira (₺)", value: "₺" },
    { label: "Livre Sterling (£)", value: "£" }
  ];

  // State for employee info
  const [employee, setEmployee] = useState({
    name: "BIYAGA BISSISSONG Ezéchias",
    role: "enseignant",
    level: "Niveau III",
    matricule: "201201",
    startDate: "15 août 2010",
    endDate: "1er mars 2023",
    totalDuration: "12 ans et 7 mois",
    totalDays: "3250",
    weeklyHours: "40 Heures",
    department: "Cours Moyen deuxième année",
    tasks: [
      "Dispenser les cours",
      "Evaluer les apprenants",
      "Limiter le redoublement",
      "Corriger les copies",
      "Tenir une salle de classe"
    ]
  });

  // States for automatic date calculation
  const [calcStart, setCalcStart] = useState("");
  const [calcEnd, setCalcEnd] = useState("");

  const autoCalculateDays = () => {
    if (calcStart && calcEnd) {
      const start = new Date(calcStart);
      const end = new Date(calcEnd);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const years = Math.floor(diffDays / 365);
      const months = Math.floor((diffDays % 365) / 30);
      setEmployee({
        ...employee,
        totalDays: diffDays.toString(),
        totalDuration: `${years} ans et ${months} mois`
      });
    }
  };

  // State for payroll data
  const [payroll, setPayroll] = useState({
    month: "AVRIL",
    year: "2026",
    seniority: "12",
    category: "III",
    echelon: "2",
    baseSalary: 150000,
    indemnities: 25000,
    socialSecurity: 5400
  });

  // State for issuance details
  const [issueDetails, setIssueDetails] = useState({
    location: "Douala",
    date: "18/04/2026"
  });

  // State for assets & signature controls
  const [logo, setLogo] = useState(null);
  const [signature, setSignature] = useState(null);
  const [sigScale, setSigScale] = useState(1);
  const [sigColorType, setSigColorType] = useState('original');
  const [stampText, setStampText] = useState("LES BASSONS - DOUALA");
  const [stampColor, setStampColor] = useState("#b91c1c");
  const [showStamp, setShowStamp] = useState(true);

  const netToPay = useMemo(() => {
    return (Number(payroll.baseSalary) + Number(payroll.indemnities)) - Number(payroll.socialSecurity);
  }, [payroll]);

  // CSS Filter for signature color
  const getSigFilter = () => {
    switch(sigColorType) {
      case 'blue': return 'sepia(100%) hue-rotate(190deg) saturate(500%) contrast(1.2)';
      case 'red': return 'sepia(100%) hue-rotate(340deg) saturate(500%) contrast(1.2)';
      case 'black': return 'grayscale(100%) brightness(0.7) contrast(2)';
      default: return 'none';
    }
  };

  const handleFileUpload = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // FANONTANA PDF (RECTIFIED)
  const exportToPDF = async () => {
    const element = document.getElementById('print-area');
    if (!element) return;

    // Jereo raha tafiditra ny script
    if (!window.html2canvas || !window.jspdf) {
      // Raha mbola tsy tafiditra ny script dia ampiasao ny window.print() mahazatra
      window.print();
      return;
    }

    try {
      const canvas = await window.html2canvas(element, {
        scale: 2, // Avo lenta
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Attestation_${employee.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      window.print(); // Fallback raha misy olana
    }
  };

  // Fitaovana fanondranana ho sary (PNG/JPEG)
  const exportToImage = async (format) => {
    const element = document.getElementById('print-area');
    if (!element || !window.html2canvas) {
      alert("Mbola mikarakara ny fitaovana sary ny milina, andraso kely azafady...");
      return;
    }

    try {
      const canvas = await window.html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const fileExt = format === 'png' ? 'png' : 'jpg';
      const dataUrl = canvas.toDataURL(mimeType, 1.0);
      
      const link = document.createElement('a');
      link.download = `Document_${employee.name.replace(/\s+/g, '_')}.${fileExt}`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Sary Error:", error);
    }
  };

  const ProfessionalStamp = ({ text, color, size = "w-40 h-40" }) => (
    <div className={`relative ${size} flex items-center justify-center opacity-90 select-none pointer-events-none`}>
      <svg viewBox="0 0 200 200" className="w-full h-full fill-current overflow-visible" style={{ color: color }}>
        <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="2,1" />
        <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="2" />
        <defs>
          <path id="circlePath" d="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0" />
        </defs>
        <text className="text-[14px] font-bold uppercase tracking-widest">
          <textPath xlinkHref="#circlePath" startOffset="50%" textAnchor="middle">
            {text} • DIRECTION • {text}
          </textPath>
        </text>
        <circle cx="100" cy="100" r="52" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <text x="100" y="95" textAnchor="middle" className="text-[18px] font-black italic uppercase">VALIDÉ</text>
        <text x="100" y="115" textAnchor="middle" className="text-[10px] font-bold uppercase tracking-tighter">Établissement Homologué</text>
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Editor */}
      <div className="w-full md:w-1/3 bg-white p-6 shadow-2xl overflow-y-auto max-h-screen print:hidden border-r border-slate-200">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
          <Briefcase size={24} /> Mpitantana Antontan-taratasy
        </h2>

        {/* SECTION 1: MAIN EMPLOYEE INFO */}
        <section className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200 shadow-sm">
          <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2 text-sm uppercase">
            <User size={16} /> MOMBA NY MPIASA
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-indigo-600 uppercase mb-1 block">Anaran'ny mpiasa (Editable)</label>
              <input 
                className="w-full p-2 border border-indigo-300 rounded text-sm font-bold bg-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={employee.name}
                onChange={(e) => setEmployee({...employee, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-indigo-600 uppercase mb-1 block">Matricule (Editable)</label>
                <input 
                  className="w-full p-2 border border-indigo-300 rounded text-sm font-mono bg-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={employee.matricule}
                  onChange={(e) => setEmployee({...employee, matricule: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-indigo-600 uppercase mb-1 block">Andraikitra</label>
                <input 
                  className="w-full p-2 border border-indigo-300 rounded text-sm bg-white" 
                  value={employee.role}
                  onChange={(e) => setEmployee({...employee, role: e.target.value})}
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: Dates and Duration */}
        <section className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-sm uppercase">
            <Calendar size={16} /> Daty sy Faharetan'ny asa
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-blue-700 uppercase mb-1 block">Daty nanombohana</label>
                <input className="w-full p-2 border rounded text-xs" value={employee.startDate} onChange={(e) => setEmployee({...employee, startDate: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-blue-700 uppercase mb-1 block">Daty nifaranana</label>
                <input className="w-full p-2 border rounded text-xs" value={employee.endDate} onChange={(e) => setEmployee({...employee, endDate: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
               <div>
                <label className="text-[10px] font-bold text-blue-700 uppercase mb-1 block">Faharetana</label>
                <input className="w-full p-2 border rounded text-xs" value={employee.totalDuration} onChange={(e) => setEmployee({...employee, totalDuration: e.target.value})} />
               </div>
               <div>
                <label className="text-[10px] font-bold text-blue-700 uppercase mb-1 block">Isan'andro</label>
                <input className="w-full p-2 border rounded text-xs" value={employee.totalDays} onChange={(e) => setEmployee({...employee, totalDays: e.target.value})} />
               </div>
            </div>
            <div className="p-2 bg-white rounded border border-blue-200">
               <p className="text-[10px] font-bold text-blue-700 uppercase mb-1 italic">Kajio ho azy ny isan'andro:</p>
               <input type="date" className="w-full p-1 text-xs border rounded mb-1" value={calcStart} onChange={(e) => setCalcStart(e.target.value)} />
               <input type="date" className="w-full p-1 text-xs border rounded mb-2" value={calcEnd} onChange={(e) => setCalcEnd(e.target.value)} />
               <button onClick={autoCalculateDays} className="w-full bg-blue-500 text-white text-[10px] py-1 rounded font-bold uppercase hover:bg-blue-600">Kajio</button>
            </div>
          </div>
        </section>

        {/* SECTION: Issuance Details */}
        <section className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2 text-sm uppercase">
            <MapPin size={16} /> Famoahana (Toerana & Daty)
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <input className="p-2 border rounded text-xs" placeholder="Toerana" value={issueDetails.location} onChange={(e) => setIssueDetails({...issueDetails, location: e.target.value})} />
            <input className="p-2 border rounded text-xs" placeholder="Daty famoahana" value={issueDetails.date} onChange={(e) => setIssueDetails({...issueDetails, date: e.target.value})} />
          </div>
        </section>

        {/* SECTION: School Header & Address */}
        <section className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-sm uppercase">
            <Palette size={16} /> Sekoly & Adiresy
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
               <label className="text-xs font-bold uppercase">Loko Theme:</label>
               <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="w-8 h-8 border-none p-0 cursor-pointer" />
            </div>
            <input className="w-full p-2 border rounded text-xs" placeholder="Anaran'ny Sekoly" value={schoolInfo.name} onChange={(e) => setSchoolInfo({...schoolInfo, name: e.target.value})} />
            <input className="w-full p-2 border rounded text-sm font-bold" placeholder="Anarana Miavaka" value={schoolInfo.subName} onChange={(e) => setSchoolInfo({...schoolInfo, subName: e.target.value})} />
            <input className="w-full p-2 border rounded text-xs italic" placeholder="Adiresy" value={schoolInfo.address} onChange={(e) => setSchoolInfo({...schoolInfo, address: e.target.value})} />
            <div className="grid grid-cols-2 gap-2 text-xs">
               <input className="p-2 border rounded" placeholder="BP" value={schoolInfo.bp} onChange={(e) => setSchoolInfo({...schoolInfo, bp: e.target.value})} />
               <input className="p-2 border rounded" placeholder="Email" value={schoolInfo.email} onChange={(e) => setSchoolInfo({...schoolInfo, email: e.target.value})} />
            </div>
          </div>
        </section>

        {/* Section: Payroll & Currency */}
        <section className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2 text-sm uppercase">
            <DollarSign size={16} /> BULLETIN DE PAYE & MARI-BOLA
          </h3>
          <div className="space-y-3 text-xs">
            <div className="bg-white p-2 rounded border border-green-200 mb-2">
               <label className="text-[10px] font-bold text-green-700 uppercase mb-1 block flex items-center gap-1">
                 <Coins size={12}/> Mari-bola (Devise)
               </label>
               <select 
                 className="w-full p-2 border border-green-300 rounded bg-green-50 font-bold"
                 value={currency}
                 onChange={(e) => setCurrency(e.target.value)}
               >
                 {currencies.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
               </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
               <input className="p-2 border rounded" placeholder="Mois" value={payroll.month} onChange={(e) => setPayroll({...payroll, month: e.target.value})} />
               <input className="p-2 border rounded" placeholder="Année" value={payroll.year} onChange={(e) => setPayroll({...payroll, year: e.target.value})} />
            </div>
            <div className="space-y-2">
               <div className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                  <label className="font-bold">Salaire de Base:</label>
                  <input type="number" className="w-24 p-1 border rounded text-right" value={payroll.baseSalary} onChange={(e) => setPayroll({...payroll, baseSalary: e.target.value})} />
               </div>
               <div className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                  <label className="font-bold">Indemnités:</label>
                  <input type="number" className="w-24 p-1 border rounded text-right" value={payroll.indemnities} onChange={(e) => setPayroll({...payroll, indemnities: e.target.value})} />
               </div>
               <div className="flex justify-between items-center bg-white p-2 rounded shadow-sm text-red-600">
                  <label className="font-bold">Cotisations Sociales:</label>
                  <input type="number" className="w-24 p-1 border rounded text-right" value={payroll.socialSecurity} onChange={(e) => setPayroll({...payroll, socialSecurity: e.target.value})} />
               </div>
            </div>
          </div>
        </section>

        {/* Section: Stamp & Signature Control */}
        <section className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2 text-sm uppercase">
            <PenTool size={16} /> Tampon & Sonia
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-red-700 uppercase">Soratra amin'ny tampon</label>
              <input className="w-full p-2 border border-red-200 rounded text-xs mt-1 bg-white" value={stampText} onChange={(e) => setStampText(e.target.value.toUpperCase())} />
            </div>
            <div className="flex items-center gap-3">
                <label className="text-[10px] font-bold text-red-700 uppercase">Loko Tampon:</label>
                <input type="color" value={stampColor} onChange={(e) => setStampColor(e.target.value)} className="w-8 h-8 border-none p-0 cursor-pointer" />
            </div>
            
            {/* Signature Customization */}
            <div className="p-3 bg-white rounded border border-red-100 space-y-3 shadow-sm">
              <label className="text-[10px] font-bold text-slate-800 uppercase block flex items-center gap-1"><Maximize size={12}/> Fanovana Sonia:</label>
              
              <div>
                <label className="text-[9px] text-gray-500 uppercase">Habe (Scale): {Math.round(sigScale * 100)}%</label>
                <input 
                  type="range" min="0.5" max="2" step="0.1" 
                  value={sigScale} 
                  onChange={(e) => setSigScale(parseFloat(e.target.value))} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>

              <div>
                <label className="text-[9px] text-gray-500 uppercase block mb-1">Lokon'ny sonia:</label>
                <div className="flex gap-2">
                  {['original', 'blue', 'red', 'black'].map(color => (
                    <button 
                      key={color}
                      onClick={() => setSigColorType(color)}
                      className={`px-2 py-1 text-[8px] rounded border uppercase font-bold transition-all ${sigColorType === color ? 'bg-red-600 text-white border-red-700' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-700 uppercase italic">Safidio ny sary Sonia:</label>
              <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-white hover:bg-slate-100 transition">
                {signature ? <img src={signature} alt="Sonia Preview" className="h-16 object-contain" style={{mixBlendMode: 'multiply', filter: getSigFilter(), transform: `scale(${sigScale})`}} /> : <span className="text-[10px] text-slate-400">Safidio ny sary</span>}
                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, setSignature)} accept="image/*" />
              </label>
            </div>

            <label className="flex flex-col items-center justify-center w-full h-14 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-white hover:bg-slate-100 transition">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter flex items-center gap-2"><Upload size={14}/> Soloina ny Logo Sekoly</span>
              <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, setLogo)} accept="image/*" />
            </label>
          </div>
        </section>

        {/* SAFIDY TELO HO AN'NY EXPORT */}
        <div className="space-y-3 mb-10">
          <button 
            onClick={exportToPDF} 
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-xl transition active:scale-95"
          >
            <FileText size={20} /> Hanonta PDF (Direct)
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => exportToImage('png')}
              className="bg-slate-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 text-xs hover:bg-slate-800 transition"
            >
              <Download size={14} /> PNG
            </button>
            <button 
              onClick={() => exportToImage('jpg')}
              className="bg-slate-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 text-xs hover:bg-slate-800 transition"
            >
              <Download size={14} /> JPEG
            </button>
          </div>
        </div>
      </div>

      {/* Document Preview Area (A4 Area) */}
      <div className="flex-1 p-8 bg-slate-200 overflow-y-auto flex justify-center print:p-0 print:bg-white">
        <div id="print-area" className="bg-white w-[210mm] min-h-[297mm] p-12 shadow-2xl print:shadow-none print:w-full relative font-sans text-gray-900 overflow-hidden print:border-none border border-slate-300">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="w-28 h-28 flex-shrink-0 flex items-center justify-center border border-dashed border-gray-100 overflow-hidden">
              {logo ? <img src={logo} alt="Logo" className="max-w-full max-h-full object-contain" /> : <div className="text-[10px] text-gray-300 uppercase font-mono">LOGO ETO</div>}
            </div>
            <div className="flex-1 text-center px-4">
              <h1 className="text-xs font-bold uppercase" style={{ color: themeColor }}>{schoolInfo.name}</h1>
              <h2 className="text-3xl font-black mb-1 tracking-widest uppercase" style={{ color: themeColor }}>{schoolInfo.subName}</h2>
              <p className="text-[11px] italic text-gray-600 mb-2">{schoolInfo.address}</p>
              <div className="flex justify-center gap-6 text-[10px] mt-1 border-t pt-1 border-gray-200">
                <span>{schoolInfo.bp}</span>
                <span>Tel: {schoolInfo.tel}</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">
                {schoolInfo.email} | {schoolInfo.phones}
              </p>
            </div>
            <div className="w-28"></div>
          </div>

          <div className="h-1.5 mb-8" style={{ backgroundColor: themeColor }}></div>

          {/* Attestation Section */}
          <div className="text-center mb-10">
            <h3 className="text-2xl font-black underline decoration-2 underline-offset-8 uppercase tracking-widest" style={{ color: themeColor }}>
              ATTESTATION DE TRAVAIL
            </h3>
          </div>

          <div className="text-justify leading-loose text-[15.5px] space-y-6 px-4 mb-12">
            <p className="indent-16">
              Mme la directrice de l'école primaire et maternelle bilingue <span className="font-bold uppercase">{schoolInfo.subName}</span>, soussignée ; 
              atteste que M. <span className="font-bold underline uppercase">{employee.name}</span>, <span className="italic">{employee.role}</span> a travaillé dans ledit établissement à titre 
              d'enseignant de {employee.level} sous le matricule <span className="font-bold font-mono">{employee.matricule}</span> du <span className="font-semibold">{employee.startDate}</span> au <span className="font-semibold">{employee.endDate}</span> soit <span className="font-semibold">{employee.totalDuration}</span> cumulant un total de <span className="font-semibold">{employee.totalDays} jours</span>.
            </p>
            <p>
              L'intéressé travaillait {employee.weeklyHours} par semaine et a occupé le poste d'enseignant du {employee.department} au sein de ladite école. Ses tâches consistaient à:
            </p>
            <ul className="list-disc ml-16 space-y-2">
              {employee.tasks.map((task, idx) => <li key={idx}>{task}</li>)}
            </ul>
            <p className="indent-16">
              En foi de quoi la présente attestation lui est délivrée pour servir et valoir ce que de droit.
            </p>
          </div>

          {/* SIGNATURE & STAMP POSITIONED SIDE BY SIDE */}
          <div className="mt-16 mr-10 flex flex-col items-end">
            <div className="text-center min-w-[450px] relative">
              <p className="font-bold mb-1 uppercase tracking-tight">Fait à {issueDetails.location}, le {issueDetails.date}</p>
              <p className="italic text-sm mb-6 uppercase tracking-wider">La Directrice</p>
              
              <div className="flex items-center justify-center gap-8 px-4">
                {showStamp && (
                  <div className="flex-shrink-0 transform rotate-[-3deg] opacity-90 transition-transform hover:rotate-0">
                    <ProfessionalStamp text={stampText} color={stampColor} size="w-36 h-36" />
                  </div>
                )}
                
                <div className="flex-shrink-0 w-48 h-36 flex items-center justify-center overflow-visible">
                  {signature ? (
                    <img 
                      src={signature} 
                      alt="Signature" 
                      className="max-h-full max-w-full object-contain"
                      style={{ 
                        mixBlendMode: 'multiply', 
                        filter: getSigFilter(),
                        transform: `scale(${sigScale})`
                      }} 
                    />
                  ) : (
                    <div className="w-full h-full border border-dashed border-gray-100 flex items-center justify-center text-[10px] text-gray-300 uppercase font-mono bg-slate-50">
                      [ Sonia eto ]
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cut Line */}
          <div className="mt-14 mb-8 relative border-t-2 border-dashed border-gray-300">
             <span className="absolute -top-3.5 left-0 text-gray-400 text-sm flex items-center gap-2 tracking-tighter">
               <Scissors size={12}/>---------------------------------------------------------------------------------------------------------------------------------------------------------
             </span>
          </div>

          {/* BULLETIN DE PAYE SECTION */}
          <div className="border-2 border-black p-6 bg-slate-50 rounded shadow-inner mb-4">
            <div className="flex justify-between items-center mb-6">
               <div className="text-[10px]">
                  <h4 className="font-bold text-gray-600 uppercase tracking-tighter">{schoolInfo.name}</h4>
                  <p className="font-black text-2xl uppercase" style={{ color: themeColor }}>{schoolInfo.subName}</p>
                  <p className="italic">{schoolInfo.address}</p>
               </div>
               <div className="border-4 border-black px-6 py-2 font-black text-base tracking-widest bg-white shadow-sm uppercase">
                  BULLETIN DE PAYE
               </div>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-xs mb-6 border-b-2 border-gray-300 pb-4">
               <div className="flex justify-between border-b border-gray-100">
                  <span className="text-gray-500 font-bold uppercase text-[9px]">MOIS/ANNÉE:</span> 
                  <span className="font-bold">{payroll.month} {payroll.year}</span>
               </div>
               <div className="flex justify-between border-b border-gray-100">
                  <span className="text-gray-500 font-bold uppercase text-[9px]">ANCIENNETÉ:</span> 
                  <span className="font-bold">{payroll.seniority} ANS</span>
               </div>
               <div className="flex justify-between border-b border-gray-100">
                  <span className="text-gray-500 font-bold uppercase text-[9px]">SALARIÉ:</span> 
                  <span className="font-black uppercase underline decoration-1">{employee.name}</span>
               </div>
               <div className="flex justify-between border-b border-gray-100">
                  <span className="text-gray-500 font-bold uppercase text-[9px]">FONCTION:</span> 
                  <span className="font-bold italic">{employee.role}</span>
               </div>
               <div className="flex justify-between border-b border-gray-100">
                  <span className="text-gray-500 font-bold uppercase text-[9px]">MATRICULE:</span> 
                  <span className="font-mono font-bold text-blue-800">{employee.matricule}</span>
               </div>
               <div className="flex justify-between border-b border-gray-100">
                  <span className="text-gray-500 font-bold uppercase text-[9px]">CATÉGORIE / ECHELON:</span> 
                  <span className="font-bold">{payroll.category} / {payroll.echelon}</span>
               </div>
            </div>

            <table className="w-full border-collapse border-2 border-black text-[12px]">
               <thead>
                  <tr className="bg-gray-100">
                    <th className="border-2 border-black p-2 text-left uppercase tracking-wider">Libellé des éléments</th>
                    <th className="border-2 border-black p-2 w-36 text-right uppercase">Gains ({currency})</th>
                    <th className="border-2 border-black p-2 w-36 text-right uppercase">Retenues ({currency})</th>
                  </tr>
               </thead>
               <tbody className="font-mono bg-white">
                  <tr className="h-9">
                    <td className="border border-black px-3 font-bold">Salaire de Base</td>
                    <td className="border border-black px-3 text-right">{Number(payroll.baseSalary).toLocaleString()}</td>
                    <td className="border border-black px-3 text-right">-</td>
                  </tr>
                  <tr className="h-9">
                    <td className="border border-black px-3 font-bold">Indemnités et Primes</td>
                    <td className="border border-black px-2 text-right">{Number(payroll.indemnities).toLocaleString()}</td>
                    <td className="border border-black px-2 text-right">-</td>
                  </tr>
                  <tr className="h-9 text-red-700 bg-red-50/30 font-bold">
                    <td className="border border-black px-3 italic text-[10px]">Cotisations Sociales (Retenues)</td>
                    <td className="border border-black px-2 text-right">-</td>
                    <td className="border border-black px-2 text-right">{Number(payroll.socialSecurity).toLocaleString()}</td>
                  </tr>
                  <tr className="h-14 font-black bg-gray-100 text-base">
                    <td className="border-2 border-black px-4 text-right uppercase tracking-tighter">MONTANT NET À PAYER</td>
                    <td colSpan="2" className="border-2 border-black px-4 text-center text-2xl bg-yellow-50 tabular-nums">
                       {netToPay.toLocaleString()} <span className="text-sm font-bold">{currency}</span>
                    </td>
                  </tr>
               </tbody>
            </table>
            
            {/* FOOTER AREA FOR BULLETIN (LOGO IN COLOR & SIGNATURE) */}
            <div className="mt-8 flex justify-between items-center px-4">
              <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
                {logo ? <img src={logo} alt="Logo" className="max-w-full max-h-full object-contain" /> : <div className="text-[8px] text-gray-400 font-mono">LOGO</div>}
              </div>

              <div className="text-center w-48 relative">
                <p className="text-[10px] font-bold uppercase mb-2">Signature Employeur</p>
                <div className="h-24 flex items-center justify-center overflow-visible">
                   {signature ? (
                    <img 
                      src={signature} 
                      alt="Signature" 
                      className="max-h-full max-w-full object-contain"
                      style={{ 
                        mixBlendMode: 'multiply', 
                        filter: getSigFilter(),
                        transform: `scale(${sigScale})`
                      }} 
                    />
                  ) : (
                    <div className="w-full h-full border border-dashed border-gray-100 bg-slate-50/50"></div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end opacity-20 grayscale text-[8px] italic">
               {showStamp && <div className="transform scale-[0.35] origin-right"><ProfessionalStamp text={stampText} color="#000" /></div>}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
          }
          .print\\:hidden { display: none !important; }
          @page { margin: 0; size: auto; }
          -webkit-print-color-adjust: exact;
        }
      `}} />
    </div>
  );
};

export default App;