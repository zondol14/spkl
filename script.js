let index = 0;

function cekInputTerakhir() {
  const forms = document.querySelectorAll("#karyawan > div");
  if (forms.length === 0) return;

  const last = forms[forms.length - 1];
  const pn = last.querySelector(".pn").value.trim();
  const nama = last.querySelector(".nama").value.trim();

  document.getElementById("btnTambah").disabled = !(pn && nama);
}


function tambahKaryawan(isFirst = false) {
  const container = document.getElementById("karyawan");

  container.insertAdjacentHTML("beforeend", `
    <div class="border p-3 mb-3 rounded bg-gray-50">
      <div class="grid grid-cols-1 md:grid-cols-6 gap-2 mb-2">
        <input class="border p-2 rounded pn" placeholder="PN" oninput="cekInputTerakhir()">
        <input class="border p-2 rounded nama" placeholder="Nama" oninput="cekInputTerakhir()">
        <input class="border p-2 rounded shift1" placeholder="Shift 1">
        <input class="border p-2 rounded shift2" placeholder="Shift 2">
        <input class="border p-2 rounded keterangan"
       placeholder="Keterangan (Opsional)">
        
      </div>

      ${
        isFirst
          ? ""
          : `<button onclick="this.parentElement.remove(); cekInputTerakhir()"
                class="text-red-600 text-sm">Hapus</button>`
      }
    </div>
  `);

  cekInputTerakhir();
}

function hitungHari(tanggal) {
  if (!tanggal) return 0;

  return tanggal
    .split(",")
    .map(x => x.trim())
    .filter(x => x)
    .length;
}

function buatTabel() {
  document.getElementById("spkl").classList.remove("hidden");
  const namaPembuat =document.getElementById("namaPembuat").value;
  const pnPembuat =document.getElementById("pnPembuat").value;
  const bulan = document.getElementById("bulan").value;
  const tahun = document.getElementById("tahun").value;
  const daftarBulan = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];
let daftarKeterangan = [];
const keteranganSudahAda = new Set();

  const hariLibur = {
  // LIBUR NASIONAL
  "1 Januari": "Tahun Baru Masehi 2026",
  "16 Januari": "Isra Mi'raj Nabi Muhammad SAW",
  "17 Februari": "Tahun Baru Imlek 2577 Kongzili",
  "19 Maret": "Hari Suci Nyepi Tahun Baru Saka 1948",
  "21 Maret": "Hari Raya Idul Fitri 1447 H",
  "22 Maret": "Hari Raya Idul Fitri 1447 H",
  "3 April": "Wafat Yesus Kristus",
  "5 April": "Hari Raya Paskah",
  "1 Mei": "Hari Buruh Internasional",
  "14 Mei": "Kenaikan Yesus Kristus",
  "27 Mei": "Hari Raya Idul Adha 1447 H",
  "31 Mei": "Hari Raya Waisak 2570 BE",
  "1 Juni": "Hari Lahir Pancasila",
  "16 Juni": "Tahun Baru Islam 1448 H",
  "17 Agustus": "Hari Kemerdekaan Republik Indonesia",
  "25 Agustus": "Maulid Nabi Muhammad SAW",
  "25 Desember": "Hari Raya Natal",

  // CUTI BERSAMA
  "16 Februari": "Cuti Bersama Tahun Baru Imlek 2577 Kongzili",
  "18 Maret": "Cuti Bersama Hari Suci Nyepi",
  "20 Maret": "Cuti Bersama Hari Raya Idul Fitri 1447 H",
  "23 Maret": "Cuti Bersama Hari Raya Idul Fitri 1447 H",
  "24 Maret": "Cuti Bersama Hari Raya Idul Fitri 1447 H",
  "15 Mei": "Cuti Bersama Kenaikan Yesus Kristus",
  "28 Mei": "Cuti Bersama Hari Raya Idul Adha 1447 H",
  "24 Desember": "Cuti Bersama Hari Raya Natal"
};


// index bulan (0-11)
const indexBulan = daftarBulan.indexOf(bulan);

// mendapatkan tanggal terakhir bulan tersebut
const tanggalTerakhir = new Date(tahun, indexBulan + 1, 0).getDate();

document.getElementById("tanggalTerbit").innerText =
  `Diterbitkan di : Tangerang, ${tanggalTerakhir} ${bulan} ${tahun}`;
 
 document.getElementById("txtnamaPembuat").innerText = namaPembuat.toUpperCase()+"/"+pnPembuat;
 document.getElementById("ttdnamaPembuat").innerText = namaPembuat.toUpperCase();
  const rows = document.querySelectorAll("#karyawan > div");
  let tbody = "";
  let no = 1;

  rows.forEach(row => {
    const pn = row.querySelector(".pn").value;
    const nama = row.querySelector(".nama").value;
    const s1 = row.querySelector(".shift1").value;
    const s2 = row.querySelector(".shift2").value;
    const ket = row.querySelector(".keterangan")?.value || "";

   [s1, s2].forEach(shift => {

  if (!shift) return;

  shift.split(",").forEach(tgl => {

    tgl = tgl.trim();

    const key = `${tgl} ${bulan}`;

let teksKeterangan = "";

if (hariLibur[key]) {
  teksKeterangan = hariLibur[key];
} else if (ket !== "") {
  teksKeterangan = ket;
} else {
  teksKeterangan = "Hari Kerja";
}

const keyKeterangan = `${tgl}-${bulan}-${teksKeterangan}`;

if (!keteranganSudahAda.has(keyKeterangan)) {

  keteranganSudahAda.add(keyKeterangan);

  daftarKeterangan.push({
    tanggal: parseInt(tgl),
    html: `
      <tr>
        <td style="width:120px; text-align:left;">
          ${tgl} ${bulan} ${tahun}
        </td>
        <td style="width:10px;">:</td>
        <td style="text-align:left;">
          ${teksKeterangan}
        </td>
      </tr>
    `
  });

}

  });

});

    // hitung berapa row yg akan dibuat
const daftar = [];

if (s1) {
  const tglUrut = s1
    .split(",")
    .map(t => parseInt(t.trim()))
    .filter(t => !isNaN(t))
    .sort((a, b) => a - b)
    .join(",");

  daftar.push({
    tgl: tglUrut,
    jenis: "Shift 1",
    mulai: "07:00",
    selesai: "19:00"
  });
}

if (s2) {
  const tglUrut = s2
    .split(",")
    .map(t => parseInt(t.trim()))
    .filter(t => !isNaN(t))
    .sort((a, b) => a - b)
    .join(",");

  daftar.push({
    tgl: tglUrut,
    jenis: "Shift 2",
    mulai: "19:00",
    selesai: "07:00"
  });
}

if (daftar.length === 0) return;

daftar.forEach((item, i) => {
  tbody += `<tr>`;

  if (i === 0) {
    tbody += `
      <td class="border p-2 text-center" rowspan="${daftar.length}">${no}</td>
      <td class="border p-2 text-center" rowspan="${daftar.length}">${pn}</td>
      <td class="border p-2 text-center" rowspan="${daftar.length}">${nama}</td>
    `;
  }

  tbody += `
    <td class="border p-2">${item.tgl} ${bulan} ${tahun}</td>
    <td class="border p-2 text-center">${hitungHari(item.tgl)} hari</td>
    <td class="border p-2 text-center">${item.mulai}</td>
    <td class="border p-2 text-center">${item.selesai}</td>
  </tr>`;
});
  });

  // Urutkan berdasarkan tanggal
daftarKeterangan.sort((a, b) => a.tanggal - b.tanggal);

// Gabungkan HTML
let htmlKeterangan = "";

daftarKeterangan.forEach(item => {
  htmlKeterangan += item.html;
});

// Tampilkan ke SPKL
document.getElementById("keteranganSPKL").innerHTML =
  htmlKeterangan || `
    <tr>
      <td colspan="3">-</td>
    </tr>
  `;


  document.getElementById("hasil").innerHTML = tbody;
  document.getElementById("spkl").classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnVerifikasi");
  const form = document.getElementById("formVerifikasi");

  if (btn && form) {
    btn.addEventListener("click", () => {
      form.classList.remove("hidden");
      form.scrollIntoView({ behavior: "smooth" });
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  tambahKaryawan(true);      // tampilkan 1 form otomatis
  cekInputTerakhir();    // pastikan tombol tambah nonaktif
});

document.getElementById("btnVerifikasi").addEventListener("click", () => {

  const container = document.getElementById("verifikasiContainer");
  container.innerHTML = "";

  const rows = document.querySelectorAll("#hasil tr");
  const bulan = document.getElementById("bulan").value;
  const tahun = document.getElementById("tahun").value;

  if (rows.length === 0) {
    alert("Generate tabel dulu");
    return;
  }

  let dataKaryawan = [];
  let current = null;

  rows.forEach(tr => {

    const td = tr.querySelectorAll("td");

    // Baris pertama karyawan (ada No, PN, Nama)
    if (td.length === 7) {

      current = {
        no: td[0].innerText,
        pn: td[1].innerText,
        nama: td[2].innerText,
        detail: []
      };

      current.detail.push({
        tanggal: td[3].innerText,
        mulai: td[5].innerText,
        selesai: td[6].innerText
      });

      dataKaryawan.push(current);
    }

    // Baris lanjutan karena rowspan
    else if (td.length === 4 && current) {

      current.detail.push({
        tanggal: td[0].innerText,
        mulai: td[2].innerText,
        selesai: td[3].innerText
      });

    }

  });

  // ==================== BUAT 1 HALAMAN PER KARYAWAN ====================
const daftarBulan = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const indexBulan = daftarBulan.indexOf(bulan);
const tanggalTerakhir = new Date(tahun, indexBulan + 1, 0).getDate();
  dataKaryawan.forEach(karyawan => {

let isiTabel = "";
let nomor = 1;

// Gabungkan semua tanggal terlebih dahulu
let semuaTanggal = [];

karyawan.detail.forEach(item => {

  const tanggalList = item.tanggal
    .replace(` ${bulan} ${tahun}`, "")
    .split(",")
    .map(t => parseInt(t.trim()))
    .filter(t => !isNaN(t));

  tanggalList.forEach(tgl => {
    semuaTanggal.push({
      tanggal: tgl,
      mulai: item.mulai,
      selesai: item.selesai
    });
  });

});

// Urutkan berdasarkan tanggal
semuaTanggal.sort((a, b) => a.tanggal - b.tanggal);

// Buat tabel
semuaTanggal.forEach(item => {

  isiTabel += `
  <tr>
    <td>${nomor}</td>
    <td>${item.tanggal} ${bulan} ${tahun}</td>
    <td>${item.mulai}</td>
    <td>${item.selesai}</td>
    <td>${item.mulai}</td>
    <td>${item.selesai}</td>
  </tr>`;

  nomor++;

});

// Tambah baris kosong sampai total 20 baris
for (let i = nomor; i <= 20; i++) {

  isiTabel += `
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>`;
}

    const div = document.createElement("div");
    div.className = "form-verifikasi";

  div.innerHTML = `
  <h2 class="text-center font-bold text-xl mb-4">
    FORM VERIFIKASI PELAKSANAAN KERJA LEMBUR
  </h2>

  <table class="mb-4">
    <tr>
      <td style="width:300px">Nama Pekerja Outsourcing</td>
      <td style="width:20px">:</td>
      <td>${karyawan.nama}</td>
    </tr>

    <tr>
      <td>Personal Number</td>
      <td>:</td>
      <td>${karyawan.pn}</td>
    </tr>

    <tr>
      <td>Perusahaan Outsourcing</td>
      <td>:</td>
      <td>PT. PRISMAS JAMINTARA</td>
    </tr>

    <tr>
      <td>Unit Kerja</td>
      <td>:</td>
      <td>KANTOR CABANG BANDARA SOEKARNO HATTA</td>
    </tr>

    <tr>
      <td>Bulan/Tahun Pelaksanaan Lembur</td>
      <td>:</td>
      <td>${bulan.toUpperCase()}/${tahun}</td>
    </tr>
  </table>
  
      <table class="lemburTable">
        <thead>
          <tr>
            <th>No</th>
            <th>Tanggal Lembur</th>
            <th>Jam Datang Kerja</th>
            <th>Jam Pulang Kerja</th>
            <th>Mulai Lembur</th>
            <th>Selesai Lembur</th>
          </tr>
        </thead>

        <tbody>
          ${isiTabel}
        </tbody>
      </table>
        <p style="margin-top:15px; margin-bottom:10px;">
    Diterbitkan di : Tangerang, ${tanggalTerakhir} ${bulan} ${tahun}
  </p>

  <table class="ttd" style="width:100%; margin-top:8px;">
  <tr>
    <th rowspan="2" style="width:20%;">PEMBUAT SPKL</th>
    <th style="width:25%;">PENGESAHAN</th>
    <th colspan="3">MENGETAHUI</th>
  </tr>

  <tr>
    <th style="width:30%;">PEJABAT PENERBIT SPKL</th>
    <th style="width:25%;">SPV VOA</th>
    <th style="width:20%;">PERUSAHAAN OUTSOURCING</th>
  </tr>

  <tr>
    <td class="ttd-box"></td>
    <td class="ttd-box"></td>
    <td class="ttd-box"></td>
    <td class="ttd-box"></td>
  </tr>

  <tr class="nama-ttd">
    <td>${karyawan.nama.toUpperCase()}</td>
    <td>ANTON DARMAWAN</td>
    <td>ADY PRASETYO</td>
    <td>NABILA</td>
  </tr>

  <tr class="jabatan-ttd">
    <td class="jabatan">Payment Point </td>
    <td class="jabatan">AMO</td>
    <td class="jabatan">Supervisor</td>
    <td class="jabatan">PT. Primas Jamintara</td>
  </tr>
</table>
`;
    

    container.appendChild(div);

  });

  document.getElementById("formVerifikasi")
          .classList.remove("hidden");

  container.classList.remove("hidden");

});
