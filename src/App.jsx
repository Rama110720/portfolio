import React, { useState, useEffect, useRef, useCallback } from 'react';
// THREE is now expected to be globally available via the script tag in tailwindConfig

import {
  Home, User, Code, Briefcase, Mail, Cpu, Globe, Lightbulb, GitBranch, MessageSquare, Award, Star, Zap,
  Linkedin, Github, Twitter, ExternalLink
} from 'lucide-react'; // Menggunakan lucide-react untuk ikon modern

// Helper untuk scroll halus
const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// --- Komponen Latar Belakang Three.js ---
function ThreeJSBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    console.log("ThreeJSBackground: useEffect dijalankan."); // Log untuk diagnostik
    const currentMount = mountRef.current;
    // Periksa apakah THREE didefinisikan secara global
    if (typeof THREE === 'undefined' || !currentMount) {
      console.error("THREE.js tidak dimuat atau referensi mount null.");
      return;
    }
    // console.log("THREE.js version:", THREE.REVISION); // Log versi Three.js untuk debugging

    // Pengaturan Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true untuk latar belakang transparan
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Partikel
    const particleCount = 1500;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x6366F1); // Indigo-600
    const color2 = new THREE.Color(0x8B5CF6); // Violet-500

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200; // X
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200; // Y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200; // Z

      const color = new THREE.Color();
      color.lerpColors(color1, color2, Math.random());
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    camera.position.z = 50;

    // Loop animasi
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotasi partikel
      particleSystem.rotation.x += 0.0005;
      particleSystem.rotation.y += 0.0008;

      renderer.render(scene, camera);
    };
    animate();

    // Tangani perubahan ukuran jendela
    const onWindowResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', onWindowResize);

    // Interaksi mouse (opsional, untuk gerakan kamera halus)
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Perbarui kamera berdasarkan posisi mouse
    const updateCamera = () => {
      camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position); // Selalu melihat ke tengah
      requestAnimationFrame(updateCamera);
    };
    updateCamera();


    // Pembersihan
    return () => {
      console.log("ThreeJSBackground: Cleanup dijalankan."); // Log untuk diagnostik
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('mousemove', onMouseMove);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particleMaterial.dispose();
      particles.dispose();
    };
  }, []); // Array dependensi kosong berarti ini berjalan sekali saat mount

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />;
}

// --- Komponen Bagian ---
// Memindahkan definisi komponen bagian ke atas App untuk memastikan mereka didefinisikan sebelum digunakan
// Mengubah semua komponen dari const () => {} menjadi function Component() {}

// Bagian Hero (Halaman Landing)
function HeroSection({ id }) {
  return (
    <section id={id} className="min-h-[calc(100vh-80px)] flex items-center justify-center text-center px-4 py-16 relative">
      <div className="max-w-3xl animate-fade-in-up">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
          Halo, saya <span className="text-indigo-400">[Nama Anda]</span>.
        </h1>
        <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Saya seorang <span className="font-semibold text-indigo-300">[Peran Utama Anda, mis. Arsitek Full-stack, Insinyur AI, Pemimpin Desain]</span>,
          bersemangat tentang <span className="italic">[passion inti Anda, mis. membangun solusi yang skalabel, menciptakan pengalaman pengguna yang intuitif, menjelajahi masa depan AI]</span>.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => scrollToSection('projects')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center group"
          >
            <Code className="h-5 w-5 mr-2 group-hover:rotate-6 transition-transform" /> Lihat Karya Saya
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center group"
          >
            <Mail className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" /> Hubungi Saya
          </button>
        </div>
      </div>
    </section>
  );
}

// Bagian Tentang Saya
function AboutMeSection({ id }) {
  return (
    <section id={id} className="py-16 px-4 sm:px-8 bg-gray-900 bg-opacity-70 backdrop-blur-sm rounded-xl shadow-2xl max-w-5xl mx-auto my-12 animate-fade-in-section">
      <h2 className="text-4xl font-bold text-indigo-400 mb-8 text-center border-b-2 border-indigo-700 pb-4">
        <User className="inline-block h-8 w-8 mr-3 text-indigo-500" /> Tentang Saya
      </h2>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-lg leading-relaxed text-gray-300">
        <img
          src="https://placehold.co/250x250/4F46E5/FFFFFF?text=Your+Professional+Photo" // Placeholder untuk foto Anda
          alt="Profil Profesional Anda"
          className="w-64 h-64 rounded-full object-cover shadow-xl border-4 border-indigo-500 flex-shrink-0"
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/250x250/4F46E5/FFFFFF?text=No+Image"; }}
        />
        <div>
          <p className="mb-4">
            Salam! Saya <span className="font-bold text-white">[Nama Anda]</span>, seorang{' '}
            <span className="font-bold text-indigo-300">[Peran Utama Anda]</span> yang sangat bersemangat dalam{' '}
            <span className="italic">[sebutkan area keahlian atau minat utama, mis. merancang arsitektur perangkat lunak yang elegan, mendesain pengalaman digital yang berpusat pada manusia, memanfaatkan data untuk wawasan yang berdampak]</span>.
            Perjalanan saya di dunia teknologi dimulai <span className="italic">[sebutkan kapan, mis. lebih dari satu dekade yang lalu, pada awal era web 2.0]</span>, didorong oleh rasa ingin tahu yang tak terpuaskan dan keinginan untuk membangun solusi yang benar-benar membuat perbedaan.
          </p>
          <p className="mb-4">
            Saya berkembang di persimpangan <span className="font-medium text-indigo-300">[Area 1, mis. framework frontend mutakhir]</span> dan{' '}
            <span className="font-medium text-indigo-300">[Area 2, mis. sistem backend yang tangguh]</span>, secara konsisten mendorong batas-batas kemungkinan.
            Keahlian saya meliputi <span className="font-medium text-indigo-300">[sebutkan 2-3 teknologi atau metodologi inti, mis. infrastruktur cloud yang skalabel, pengembangan agile, analitik data tingkat lanjut]</span>,
            memungkinkan saya untuk mengatasi tantangan kompleks dengan pendekatan holistik dan inovatif.
          </p>
          <p>
            Di luar keyboard, saya adalah seorang <span className="italic">[sebutkan hobi unik atau minat pribadi yang mencerminkan sifat positif, mis. astrofotografer, pemain catur kompetitif, sukarelawan untuk proyek open-source]</span>.
            Keseimbangan antara pengejaran profesional dan pribadi ini memicu kreativitas saya dan memberikan perspektif baru, memungkinkan saya untuk mendekati masalah dengan perpaduan ketelitian teknis dan pemikiran imajinatif yang unik.
          </p>
        </div>
      </div>
    </section>
  );
}

// Bagian Keahlian
function SkillsSection({ id }) {
  const skills = {
    'Frontend': ['React', 'Next.js', 'Vue.js', 'Angular', 'Tailwind CSS', 'Sass', 'HTML5', 'CSS3', 'TypeScript', 'D3.js', 'Three.js'],
    'Backend': ['Node.js (Express)', 'Python (Django, Flask)', 'Go', 'Ruby on Rails', 'Java (Spring Boot)', 'RESTful APIs', 'GraphQL', 'Microservices'],
    'Databases': ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase/Firestore', 'Elasticsearch'],
    'Cloud & DevOps': ['AWS', 'Google Cloud Platform (GCP)', 'Azure', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Serverless'],
    'Tools & Methodologies': ['Git', 'Jira', 'Agile/Scrum', 'TDD', 'Figma', 'WebSockets', 'Performance Optimization'],
    'AI/ML (jika berlaku)': ['TensorFlow', 'PyTorch', 'Scikit-learn', 'NLP', 'Computer Vision', 'Generative AI']
  };

  return (
    <section id={id} className="py-16 px-4 sm:px-8 bg-gray-900 bg-opacity-70 backdrop-blur-sm rounded-xl shadow-2xl max-w-5xl mx-auto my-12 animate-fade-in-section">
      <h2 className="text-4xl font-bold text-indigo-400 mb-8 text-center border-b-2 border-indigo-700 pb-4">
        <Code className="inline-block h-8 w-8 mr-3 text-indigo-500" /> Keahlian Saya
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(skills).map(([category, skillList]) => (
          <div key={category} className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300 group">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Star className="h-5 w-5 mr-3 text-yellow-400 group-hover:animate-pulse" /> {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skillList.map((skill, index) => (
                <span key={index} className="bg-indigo-700 bg-opacity-40 text-indigo-200 text-sm font-medium px-3 py-1 rounded-full border border-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors duration-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Bagian Pengalaman (Linimasa)
function ExperienceSection({ id }) {
  const experiences = [
    {
      year: '2023 - Sekarang',
      title: 'Insinyur Perangkat Lunak Senior',
      company: 'Tech Innovators Inc.',
      description: 'Memimpin pengembangan microservices yang skalabel menggunakan Go dan Kubernetes, meningkatkan kinerja sistem sebesar 30%. Membimbing insinyur junior dan berkontribusi pada keputusan desain arsitektur.',
      tags: ['Go', 'Kubernetes', 'AWS', 'Microservices', 'Kepemimpinan']
    },
    {
      year: '2020 - 2023',
      title: 'Pengembang Full-stack',
      company: 'Digital Solutions Co.',
      description: 'Mengembangkan dan memelihara aplikasi web yang tangguh menggunakan React dan Node.js. Mengimplementasikan fitur baru, mengoptimalkan kueri database, dan memastikan kode berkualitas tinggi melalui pengujian yang ketat.',
      tags: ['React', 'Node.js', 'PostgreSQL', 'RESTful APIs', 'Agile']
    },
    {
      year: '2018 - 2020',
      title: 'Pengembang Frontend Junior',
      company: 'Creative Web Studio',
      description: 'Membangun antarmuka pengguna yang responsif dan interaktif dengan HTML, CSS, dan JavaScript. Berkolaborasi dengan tim desain untuk menerjemahkan wireframe menjadi halaman web yang sempurna.',
      tags: ['HTML', 'CSS', 'JavaScript', 'jQuery', 'UI/UX']
    },
  ];

  return (
    <section id={id} className="py-16 px-4 sm:px-8 bg-gray-900 bg-opacity-70 backdrop-blur-sm rounded-xl shadow-2xl max-w-5xl mx-auto my-12 animate-fade-in-section">
      <h2 className="text-4xl font-bold text-indigo-400 mb-8 text-center border-b-2 border-indigo-700 pb-4">
        <Briefcase className="inline-block h-8 w-8 mr-3 text-indigo-500" /> Perjalanan Saya
      </h2>
      <div className="relative pl-6 sm:pl-10 after:absolute after:top-0 after:bottom-0 after:left-0 after:w-1 after:bg-indigo-600 after:rounded-full">
        {experiences.map((exp, index) => (
          <div key={index} className="mb-10 relative group">
            <div className="absolute -left-3 sm:-left-7 top-0 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold z-10 border-4 border-gray-900 group-hover:scale-125 transition-transform duration-300">
              <Zap className="h-4 w-4" />
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg ml-4 sm:ml-8 border border-gray-700 group-hover:border-indigo-500 transition-all duration-300">
              <p className="text-sm text-gray-400 mb-1">{exp.year}</p>
              <h3 className="text-xl font-semibold text-white mb-1">{exp.title}</h3>
              <p className="text-indigo-300 mb-3">{exp.company}</p>
              <p className="text-gray-300 mb-4">{exp.description}</p>
              <div className="flex flex-wrap gap-2">
                {exp.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full border border-gray-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Bagian Proyek
function ProjectsSection({ id }) {
  const projects = [
    {
      title: 'Quantum Ledger (React, Node.js, GraphQL)',
      description: 'Aplikasi ledger terdistribusi yang aman untuk melacak aset digital. Fitur pembaruan real-time, otentikasi yang kuat, dan visualisasi data yang kompleks.',
      link: '#', // Ganti dengan tautan proyek sebenarnya
      image: 'https://placehold.co/400x250/2D3748/E2E8F0?text=Proyek+1',
      tags: ['React', 'Node.js', 'GraphQL', 'PostgreSQL', 'WebSockets']
    },
    {
      title: 'AI-Powered Content Generator (Python, Flask, GPT-3)',
      description: 'Layanan web yang menghasilkan konten kreatif (artikel, cerita) berdasarkan prompt pengguna. Terintegrasi dengan model bahasa besar melalui API Python Flask.',
      link: '#', // Ganti dengan tautan proyek sebenarnya
      image: 'https://placehold.co/400x250/2D3748/E2E8F0?text=Proyek+2',
      tags: ['Python', 'Flask', 'GPT-3', 'Machine Learning', 'Integrasi API']
    },
    {
      title: '3D Interactive Data Explorer (Three.js, D3.js)',
      description: 'Aplikasi web imersif untuk memvisualisasikan dataset kompleks dalam ruang 3D. Pengguna dapat berinteraksi dengan titik data, memfilter, dan menjelajahi hubungan.',
      link: '#', // Ganti dengan tautan proyek sebenarnya
      image: 'https://placehold.co/400x250/2D3748/E2E8F0?text=Proyek+3',
      tags: ['Three.js', 'D3.js', 'WebGL', 'Visualisasi Data', 'JavaScript']
    },
    {
      title: 'Serverless Microservice Orchestrator (AWS Lambda, Go)',
      description: 'Merancang dan mengimplementasikan arsitektur serverless untuk mengorkestrasi beberapa microservices, secara signifikan mengurangi biaya operasional dan meningkatkan skalabilitas.',
      link: '#', // Ganti dengan tautan proyek sebenarnya
      image: 'https://placehold.co/400x250/2D3748/E2E8F0?text=Proyek+4',
      tags: ['AWS Lambda', 'Go', 'Serverless', 'Microservices', 'Arsitektur Cloud']
    },
  ];

  const [simulatedBackendData, setSimulatedBackendData] = useState(null);
  const [loadingBackendData, setLoadingBackendData] = useState(false);
  const [backendError, setBackendError] = useState(null);

  // Fungsi untuk mensimulasikan pengambilan data backend
  const fetchSimulatedBackendData = async () => {
    setLoadingBackendData(true);
    setBackendError(null);
    setSimulatedBackendData(null);

    try {
      // Dalam aplikasi nyata, ini akan menjadi fetch ke backend Python atau Node.js Anda:
      // const response = await fetch('/api/get-dynamic-project-inspiration');
      // const data = await response.json();
      // setSimulatedBackendData(data);

      // Untuk demonstrasi ini, kami mensimulasikan penyediaan data backend setelah penundaan.
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulasikan penundaan jaringan

      const simulatedData = {
        message: "Data ini bisa berasal dari backend Python/Node.js, CMS, atau database!",
        inspiration: "Pertimbangkan untuk menambahkan proyek yang menunjukkan keahlian Anda dalam WebAssembly atau Quantum Computing.",
        dynamicProjects: [
          {
            title: 'Sistem Pemungutan Suara Terdesentralisasi (Solidity, Web3.js)',
            description: 'Aplikasi pemungutan suara berbasis blockchain yang aman dan transparan. Memastikan imutabilitas dan hasil yang dapat diverifikasi menggunakan smart contract.',
            link: '#',
            image: 'https://placehold.co/400x250/2D3748/E2E8F0?text=Proyek+Blockchain',
            tags: ['Solidity', 'Web3.js', 'Ethereum', 'Blockchain', 'Smart Contracts']
          },
          {
            title: 'Whiteboard Kolaboratif Real-time (WebSockets, Redis)',
            description: 'Whiteboard berbasis web yang memungkinkan banyak pengguna untuk menggambar dan berinteraksi secara bersamaan secara real-time. Memanfaatkan WebSockets untuk komunikasi instan.',
            link: '#',
            image: 'https://placehold.co/400x250/2D3748/E2E8F0?text=Kolaborasi+Realtime',
            tags: ['WebSockets', 'Node.js', 'Redis', 'Real-time', 'Canvas API']
          }
        ]
      };
      setSimulatedBackendData(simulatedData);

    } catch (error) {
      console.error("Error mengambil data backend yang disimulasikan:", error);
      setBackendError("Gagal memuat konten dinamis. Silakan coba lagi.");
    } finally {
      setLoadingBackendData(false);
    }
  };

  useEffect(() => {
    // Secara opsional ambil data yang disimulasikan saat komponen dimuat
    // fetchSimulatedBackendData();
  }, []);

  return (
    <section id={id} className="py-16 px-4 sm:px-8 bg-gray-900 bg-opacity-70 backdrop-blur-sm rounded-xl shadow-2xl max-w-5xl mx-auto my-12 animate-fade-in-section">
      <h2 className="text-4xl font-bold text-indigo-400 mb-8 text-center border-b-2 border-indigo-700 pb-4">
        <GitBranch className="inline-block h-8 w-8 mr-3 text-indigo-500" /> Proyek Saya
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {projects.map((project, index) => (
          <div key={index} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:border-indigo-500 transition-all duration-300 flex flex-col h-full">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-48 object-cover object-center"
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x250/2D3748/E2E8F0?text=Gambar+Tidak+Ditemukan"; }}
            />
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-2xl font-semibold text-white mb-3">{project.title}</h3>
              <p className="text-gray-300 mb-4 flex-grow">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="bg-indigo-700 bg-opacity-40 text-indigo-200 text-xs font-medium px-2.5 py-0.5 rounded-full border border-indigo-600">
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-2 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors duration-300 self-start group"
              >
                Lihat Proyek <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Konten Dinamis dari Backend yang Disimulasikan */}
      <div className="text-center mt-12 pt-8 border-t border-gray-700">
        <h3 className="text-3xl font-bold text-indigo-400 mb-6">
          <Globe className="inline-block h-7 w-7 mr-2 text-indigo-500" /> Inspirasi Proyek Dinamis (Backend yang Disimulasikan)
        </h3>
        <p className="text-gray-400 mb-6">
          Bagian ini menunjukkan bagaimana proyek dapat dimuat secara dinamis dari API backend atau CMS headless,
          memungkinkan manajemen konten yang fleksibel tanpa perubahan kode.
        </p>
        <button
          onClick={fetchSimulatedBackendData}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto mb-8 group"
          disabled={loadingBackendData}
        >
          {loadingBackendData ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Mengambil Data...
            </>
          ) : (
            <>
              <Cpu className="h-5 w-5 mr-2 group-hover:animate-bounce" /> Ambil Proyek Dinamis
            </>
          )}
        </button>

        {backendError && (
          <p className="text-red-400 mt-4 text-lg">{backendError}</p>
        )}

        {simulatedBackendData && (
          <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-inner text-left animate-fade-in">
            <p className="text-indigo-300 text-lg mb-4">{simulatedBackendData.message}</p>
            <p className="text-gray-300 mb-6">{simulatedBackendData.inspiration}</p>
            <h4 className="text-xl font-semibold text-white mb-4">Proyek Dinamis yang Disimulasikan:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {simulatedBackendData.dynamicProjects.map((project, index) => (
                <div key={`dynamic-${index}`} className="bg-gray-700 p-5 rounded-lg shadow-md border border-gray-600">
                  <h5 className="text-lg font-semibold text-white mb-2">{project.title}</h5>
                  <p className="text-gray-300 text-sm mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="bg-gray-600 text-gray-200 text-xs px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline text-sm flex items-center">
                    Lihat <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Bagian Wawasan Berbasis AI
function AIDrivenInsightsSection({ id }) {
  const [insight, setInsight] = useState("Klik tombol untuk menghasilkan wawasan berbasis AI yang segar tentang tren pemrograman!");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [insightError, setInsightError] = useState(null);

  const generateInsight = async () => {
    setLoadingInsight(true);
    setInsightError(null);
    setInsight("Menghasilkan wawasan...");

    try {
      // Simulasikan panggilan API ke backend yang menggunakan LLM (mis. Gemini API melalui Python/Node.js)
      // Dalam skenario nyata, backend Anda akan memanggil Gemini API.
      // Untuk contoh frontend-only ini, kami akan mensimulasikan respons.

      const prompts = [
        "Munculnya WebAssembly mengubah aplikasi berbasis browser, mendorong batas kinerja dan memungkinkan kasus penggunaan baru untuk bahasa seperti Rust dan C++ di web.",
        "AI Generatif, khususnya model bahasa besar, merevolusi pengembangan perangkat lunak dengan membantu pembuatan kode, debugging, dan dokumentasi, secara fundamental mengubah alur kerja pengembang.",
        "Komputasi edge dan fungsi serverless menjadi semakin lazim, memungkinkan solusi yang sangat skalabel dan hemat biaya dengan membawa komputasi lebih dekat ke sumber data.",
        "Adopsi Rust untuk pemrograman tingkat sistem dan layanan web berkinerja tinggi berkembang pesat karena keamanan memori dan jaminan konkurensinya.",
        "Platform low-code/no-code memberdayakan pengembang warga, tetapi juga mendorong kebutuhan pengembang profesional untuk membangun integrasi yang lebih kompleks dan komponen kustom.",
        "Keamanan siber tetap menjadi perhatian utama, dengan penekanan yang meningkat pada praktik DevSecOps untuk mengintegrasikan keamanan di seluruh siklus hidup pengembangan perangkat lunak.",
        "Konvergensi IoT, AI, dan 5G menciptakan peluang baru untuk aplikasi cerdas dan real-time di berbagai industri.",
        "Observabilitas dan alat pemantauan yang tangguh sangat penting untuk mengelola sistem terdistribusi yang kompleks, memberikan wawasan mendalam tentang kesehatan dan kinerja aplikasi.",
        "Pergeseran menuju arsitektur yang dapat disusun dan micro-frontend memungkinkan aplikasi web yang lebih modular, mudah dipelihara, dan skalabel."
      ];

      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulasikan penundaan jaringan

      const randomInsight = prompts[Math.floor(Math.random() * prompts.length)];
      setInsight(randomInsight);

    } catch (error) {
      console.error("Error menghasilkan wawasan:", error);
      setInsightError("Gagal menghasilkan wawasan. Silakan coba lagi.");
      setInsight("Tidak dapat mengambil wawasan.");
    } finally {
      setLoadingInsight(false);
    }
  };

  return (
    <section id={id} className="py-16 px-4 sm:px-8 bg-gray-900 bg-opacity-70 backdrop-blur-sm rounded-xl shadow-2xl max-w-5xl mx-auto my-12 animate-fade-in-section">
      <h2 className="text-4xl font-bold text-indigo-400 mb-8 text-center border-b-2 border-indigo-700 pb-4">
        <Lightbulb className="inline-block h-8 w-8 mr-3 text-indigo-500" /> Wawasan Berbasis AI
      </h2>
      <div className="text-center">
        <p className="text-gray-300 text-lg mb-6 max-w-3xl mx-auto">
          Bagian ini menunjukkan integrasi yang disimulasikan dengan model AI (seperti Gemini) untuk memberikan wawasan atau konten dinamis,
          menunjukkan keahlian dalam memanfaatkan teknologi AI mutakhir.
        </p>
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 mb-8 min-h-[150px] flex items-center justify-center">
          {loadingInsight ? (
            <div className="flex flex-col items-center text-indigo-400">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p>Berpikir keras...</p>
            </div>
          ) : insightError ? (
            <p className="text-red-400 text-xl">{insightError}</p>
          ) : (
            <p className="text-white text-xl italic leading-relaxed">"{insight}"</p>
          )}
        </div>
        <button
          onClick={generateInsight}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto group"
          disabled={loadingInsight}
        >
          <Award className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" /> Hasilkan Wawasan Baru
        </button>
      </div>
    </section>
  );
}

// Bagian Kontak
function ContactSection({ id }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState(''); // 'idle', 'sending', 'success', 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      // Dalam aplikasi nyata, ini akan menjadi fetch ke endpoint kontak backend Node.js/Python Anda:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      // if (response.ok) {
      //   setFormStatus('success');
      //   setFormData({ name: '', email: '', message: '' });
      // } else {
      //   setFormStatus('error');
      // }

      // Simulasikan panggilan API yang berhasil
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (formData.name && formData.email && formData.message) {
        setFormStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFormStatus('error');
      }

    } catch (error) {
      console.error("Error pengiriman formulir kontak:", error);
      setFormStatus('error');
    }
  };

  return (
    <section id={id} className="py-16 px-4 sm:px-8 bg-gray-900 bg-opacity-70 backdrop-blur-sm rounded-xl shadow-2xl max-w-5xl mx-auto my-12 animate-fade-in-section">
      <h2 className="text-4xl font-bold text-indigo-400 mb-8 text-center border-b-2 border-indigo-700 pb-4">
        <Mail className="inline-block h-8 w-8 mr-3 text-indigo-500" /> Hubungi Saya
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Formulir Kontak */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-2xl font-semibold text-white mb-6">Kirim Pesan</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">
                Nama
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="shadow appearance-none border border-gray-600 rounded w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 transition-colors duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="shadow appearance-none border border-gray-600 rounded w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 transition-colors duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-300 text-sm font-bold mb-2">
                Pesan
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                className="shadow appearance-none border border-gray-600 rounded w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 transition-colors duration-200"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
              disabled={formStatus === 'sending'}
            >
              {formStatus === 'sending' ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengirim...
                </>
              ) : (
                <>
                  <MessageSquare className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" /> Kirim Pesan
                </>
              )}
            </button>
            {formStatus === 'success' && (
              <p className="text-green-400 mt-4 text-center text-lg">Pesan berhasil dikirim! Terima kasih.</p>
            )}
            {formStatus === 'error' && (
              <p className="text-red-400 mt-4 text-center text-lg">Gagal mengirim pesan. Silakan coba lagi.</p>
            )}
          </form>
        </div>

        {/* Tautan Sosial */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-2xl font-semibold text-white mb-6">Terhubung dengan Saya</h3>
          <ul className="space-y-6">
            <li>
              <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-indigo-400 transition-colors duration-200 group">
                <Linkedin className="h-8 w-8 mr-4 text-indigo-500 group-hover:scale-110 transition-transform" />
                <span className="text-lg">LinkedIn/yourprofile</span>
              </a>
            </li>
            <li>
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-indigo-400 transition-colors duration-200 group">
                <Github className="h-8 w-8 mr-4 text-gray-400 group-hover:scale-110 transition-transform" />
                <span className="text-lg">GitHub/yourusername</span>
              </a>
            </li>
            <li>
              <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-indigo-400 transition-colors duration-200 group">
                <Twitter className="h-8 w-8 mr-4 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-lg">Twitter/@yourhandle</span>
              </a>
            </li>
            <li>
              <a href="mailto:your.email@example.com" className="flex items-center text-gray-300 hover:text-indigo-400 transition-colors duration-200 group">
                <Mail className="h-8 w-8 mr-4 text-red-400 group-hover:scale-110 transition-transform" />
                <span className="text-lg">your.email@example.com</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

// --- Komponen Aplikasi Utama ---
function App() { // Mengubah App menjadi fungsi standar
  const [activeSection, setActiveSection] = useState('hero');

  // Log untuk diagnostik: Pastikan komponen App dijalankan
  useEffect(() => {
    console.log("Komponen App dimuat dan dirender.");
    const rootElement = document.getElementById('root');
    if (rootElement) {
      console.log("Elemen #root ditemukan:", rootElement);
    } else {
      console.error("Elemen #root TIDAK ditemukan!");
    }
    // Tambahkan log untuk setiap komponen bagian
    console.log("HeroSection type:", typeof HeroSection);
    console.log("AboutMeSection type:", typeof AboutMeSection);
    console.log("SkillsSection type:", typeof SkillsSection);
    console.log("ExperienceSection type:", typeof ExperienceSection);
    console.log("ProjectsSection type:", typeof ProjectsSection);
    console.log("AIDrivenInsightsSection type:", typeof AIDrivenInsightsSection);
    console.log("ContactSection type:", typeof ContactSection);

  }, []);

  // Item navigasi dengan ikon
  const navItems = [
    { name: 'Home', id: 'hero', icon: Home },
    { name: 'About', id: 'about', icon: User },
    { name: 'Skills', id: 'skills', icon: Code },
    { name: 'Experience', id: 'experience', icon: Briefcase },
    { name: 'Projects', id: 'projects', icon: GitBranch },
    { name: 'Insights', id: 'insights', icon: Lightbulb },
    { name: 'Contact', id: 'contact', icon: Mail },
  ];

  // Fungsi untuk menangani scroll dan memperbarui bagian aktif
  const handleScroll = useCallback(() => {
    const sections = navItems.map(item => document.getElementById(item.id)).filter(Boolean);
    const scrollPosition = window.scrollY + window.innerHeight / 2; // Periksa bagian tengah viewport

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section.offsetTop <= scrollPosition) {
        setActiveSection(section.id);
        break;
      }
    }
  }, [navItems]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Pemeriksaan awal
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);


  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 font-inter text-gray-100 overflow-hidden">
      {/* Latar Belakang Three.js */}
      <ThreeJSBackground />

      {/* Navigasi Tetap */}
      <nav className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-80 backdrop-blur-md z-50 shadow-lg py-3 px-4 sm:px-8 flex justify-center">
        <ul className="flex flex-wrap justify-center gap-2 sm:gap-4">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className={`flex items-center px-3 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${activeSection === item.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Area Konten Utama */}
      <main className="relative z-10 pt-20"> {/* Tambahkan padding-top untuk mengakomodasi nav tetap */}
        <HeroSection id="hero" />
        <AboutMeSection id="about" />
        <SkillsSection id="skills" />
        <ExperienceSection id="experience" />
        <ProjectsSection id="projects" />
        <AIDrivenInsightsSection id="insights" />
        <ContactSection id="contact" />
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-gray-400 text-sm py-8 px-4 border-t border-gray-700 mt-12">
        &copy; {new Date().getFullYear()} [Nama Anda]. Dibuat dengan <span className="text-red-500">&hearts;</span> dan Kode.
      </footer>
    </div>
  );
}

// Konfigurasi Tailwind CSS (disertakan langsung di HTML untuk pratinjau Canvas)
// Ini biasanya ada di file tailwind.config.js dalam proyek nyata.
// Menambahkan animasi fade-in sederhana
const tailwindConfig = `
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r150/three.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    .font-inter {
      font-family: 'Inter', sans-serif;
    }
    .animate-fade-in-up {
      animation: fadeInUp 1s ease-out forwards;
      opacity: 0;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-section {
      animation: fadeInSection 1s ease-out forwards;
      opacity: 0;
    }
    @keyframes fadeInSection {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
`;

// Ini adalah pola umum untuk aplikasi React dalam satu file HTML.
// Panggilan ReactDOM.render() ditangani oleh lingkungan Canvas.
// Anda hanya perlu mengekspor komponen App utama.
export default App;
