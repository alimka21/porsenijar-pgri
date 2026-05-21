// GANTI DENGAN URL WEB APP GOOGLE APPS SCRIPT ANDA
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwci6hg6SOOlGFrCc5QuaGfXMVHZhCdJYrkLMjtHJc__IvfbdfuYMQJBiirn_UYaPbyIg/exec";

document.getElementById('cek-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const searchKey = document.getElementById('searchKey').value.trim();
  const email = document.getElementById('email').value.trim();
  
  const searchSection = document.getElementById('search-section');
  const loadingSection = document.getElementById('loading-section');
  const resultSection = document.getElementById('result-section');
  const resultContent = document.getElementById('result-content');
  
  // Tampilkan loading
  searchSection.classList.add('hidden');
  loadingSection.classList.remove('hidden');
  
  try {
    const response = await fetch(`${WEB_APP_URL}?searchKey=${encodeURIComponent(searchKey)}&email=${encodeURIComponent(email)}`);
    const data = await response.json();
    
    loadingSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    
    if (data.status === "not_found") {
      resultContent.innerHTML = `
        <div class="text-center space-y-4">
          <div class="text-red-500 text-5xl"><i class="fa-solid fa-circle-xmark"></i></div>
          <h3 class="text-lg font-bold text-slate-800">Data Tidak Ditemukan</h3>
          <p class="text-slate-600 text-sm leading-relaxed">Kombinasi NIP/NPA dan Email tidak terdaftar dalam basis data panitia PORSENIJAR 2026. Silakan periksa kembali ketikan Anda.</p>
        </div>
      `;
      return;
    }
    
    // Logika Pemisahan Tampilan berdasarkan Status Dropdown (Kolom P)
    switch(data.verifikasi) {
      case "Diterima":
        resultContent.innerHTML = `
          <div class="text-center space-y-4">
            <div class="text-green-500 text-5xl animate-bounce"><i class="fa-solid fa-circle-check"></i></div>
            <h3 class="text-xl font-bold text-green-600">Selamat, Anda Diterima!</h3>
            <p class="text-slate-700 text-sm">Anda dinyatakan lolos sebagai peserta resmi <strong>PORSENIJAR PGRI 2026</strong> pada cabang:</p>
            <div class="bg-green-50 text-green-800 font-semibold py-2 px-4 rounded-lg inline-block text-sm border border-green-200">
              ${data.cabang}
            </div>
            <p class="text-xs text-slate-500 pt-2">Silakan bergabung ke dalam grup koordinasi resmi melalui tombol di bawah ini:</p>
            <a href="${data.waLink}" target="_blank" rel="noopener noreferrer"
              class="inline-flex items-center justify-center space-x-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition duration-200 shadow-md shadow-emerald-100">
              <i class="fa-brands fa-whatsapp text-xl"></i>
              <span>Gabung Grup WhatsApp</span>
            </a>
          </div>
        `;
        break;
        
      case "Revisi":
        resultContent.innerHTML = `
          <div class="text-center space-y-4">
            <div class="text-amber-500 text-5xl"><i class="fa-solid fa-triangle-exclamation"></i></div>
            <h3 class="text-xl font-bold text-amber-600">Status: Perlu Revisi</h3>
            <p class="text-slate-700 text-sm">Berkas pendaftaran Anda untuk cabang <strong>${data.cabang}</strong> membutuhkan perbaikan data.</p>
            <div class="p-4 bg-amber-50 border border-amber-200 rounded-xl text-left text-xs text-amber-800 space-y-1">
              <span class="font-bold block text-sm mb-1"><i class="fa-solid fa-info-circle"></i> Langkah Selanjutnya:</span>
              Silakan periksa kotak masuk email Anda secara berkala atau hubungi Sekretariat PGRI Daerah untuk detail data yang harus diperbaiki.
            </div>
          </div>
        `;
        break;
        
      case "Tolak":
        resultContent.innerHTML = `
          <div class="text-center space-y-4">
            <div class="text-rose-500 text-5xl"><i class="fa-solid fa-circle-minus"></i></div>
            <h3 class="text-xl font-bold text-slate-800">Mohon Maaf</h3>
            <p class="text-slate-600 text-sm leading-relaxed">Setelah dilakukan proses seleksi berkas, pendaftaran Anda untuk komponen seleksi <strong>${data.cabang}</strong> belum dapat kami setujui untuk tahun ini.</p>
            <p class="text-xs text-slate-400 italic">Terima kasih atas partisipasi dan dedikasi luar biasa yang telah Anda tunjukkan.</p>
          </div>
        `;
        break;
        
      default:
        resultContent.innerHTML = `
          <div class="text-center space-y-3">
            <div class="text-slate-400 text-5xl"><i class="fa-solid fa-hourglass-half"></i></div>
            <h3 class="text-lg font-bold text-slate-700">Dalam Proses Verifikasi</h3>
            <p class="text-slate-500 text-sm">Berkas Anda telah tersimpan. Mohon tunggu proses validasi selesai dilakukan oleh tim verifikator panitia.</p>
          </div>
        `;
    }
    
  } catch (error) {
    console.error(error);
    loadingSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    resultContent.innerHTML = `
      <div class="text-center space-y-3 text-red-600">
        <i class="fa-solid fa-triangle-exclamation text-4xl"></i>
        <h3 class="font-bold">Gangguan Jaringan</h3>
        <p class="text-xs text-slate-500">Gagal terhubung dengan server. Silakan coba beberapa saat lagi.</p>
      </div>
    `;
  }
});

function resetForm() {
  document.getElementById('cek-form').reset();
  document.getElementById('search-section').classList.remove('hidden');
  document.getElementById('result-section').classList.add('hidden');
}
