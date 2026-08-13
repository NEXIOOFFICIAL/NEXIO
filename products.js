const productGrid =
    document.getElementById("productGrid");

if(productGrid){

    productGrid.innerHTML = `
        <div class="product-loading">
            Memuat produk...
        </div>
    `;

    fetch("https://script.google.com/macros/s/AKfycbyuJnpSAJmwAMLdMhEN26hsibAShv1z8uQOsvGw80GRrcf9zr0RPJbC6fe5nhzppnlc1g/exec")
    .then(res => {

        if(!res.ok){
            throw new Error("Gagal mengambil data produk");
        }

        return res.json();

    })
    .then(products => {

        productGrid.innerHTML = "";

        window.semuaProduk = products;

        buatFilter(products);


        // Cek produk dari Recommended Products
        const params =
            new URLSearchParams(window.location.search);

        const idPilihan = params.get("id");


        if(idPilihan){

            const produkPilihan = products.find(
                p => String(p.id) === String(idPilihan)
            );


            if(produkPilihan){

                const produkLain = products.filter(
                    p => String(p.id) !== String(idPilihan)
                );


                // Produk pilihan Recommended paling atas
                renderProducts([
                    produkPilihan,
                    ...produkLain
                ]);

            }else{

                renderProducts(products);

            }

        }else{

            renderProducts(products);

        }

    })
    .catch(err => {

        console.error("Products:", err);

        productGrid.innerHTML = `
            <div class="product-loading">
                Produk belum dapat dimuat.<br>
                Silakan refresh halaman.
            </div>
        `;

    });

}


// =========================
// FORMAT HARGA
// =========================

function formatHarga(harga){

    if(harga === null || harga === undefined || harga === ""){
        return "-";
    }

    const text = harga.toString().trim();

    const match = text.match(/^(\d+(?:\.\d+)?)(.*)$/);

    if(!match){
        return "Rp" + text;
    }

    const angka = Number(match[1]).toLocaleString("id-ID");

    return "Rp" + angka + match[2];

}


// =========================
// RENDER PRODUCTS
// =========================

function renderProducts(products){

    const grid = document.getElementById("productGrid");

    grid.innerHTML = "";

    products.forEach(produk => {

        const gambar = produk.gambar
            ? `image produk/${produk.gambar}`
            : "image produk/no-image.png";

        const adaHargaCoret =
            produk.hargaCoret !== null &&
            produk.hargaCoret !== undefined &&
            produk.hargaCoret !== "";

        grid.innerHTML += `

        <div class="product-card">

            ${adaHargaCoret ? `
            <div class="promo-badge">
                🔥 PROMO
            </div>
            ` : ""}

            <img
                src="${gambar}"
                class="product-image"
            >

            <div class="product-name">
                ${produk.nama}
            </div>

            ${adaHargaCoret ? `
            <div class="product-old-price">
                ${formatHarga(produk.hargaCoret)}
            </div>
            ` : ""}

            <div class="product-price">
                ${formatHarga(produk.harga)}
            </div>

            <div class="cart-action">

                <button
                    class="cart-btn"
                    onclick="tambahKeranjangById('${produk.id}')"
                >
                    🛒 Tambah
                </button>

                <div
                    class="qty-control"
                    id="qty-${produk.id}"
                    style="display:none;"
                >

                    <button
                        onclick="kurangiProdukById('${produk.id}')"
                    >
                        −
                    </button>

                    <span>0</span>

                    <button
                        onclick="tambahProdukById('${produk.id}')"
                    >
                        +
                    </button>

                </div>

            </div>

        </div>

        `;

        updateQty(produk.id, produk.nama);

    });

}


// =========================
// TAMBAH KE KERANJANG
// =========================

function tambahKeranjangById(id){

    const produk = window.semuaProduk.find(
        p => String(p.id) === String(id)
    );

    if(!produk) return;

    tambahKeranjang(
        produk.nama,
        produk.harga,
        produk.id
    );

}


// =========================
// TAMBAH JUMLAH
// =========================

function tambahProdukById(id){

    const produk = window.semuaProduk.find(
        p => String(p.id) === String(id)
    );

    if(!produk) return;

    tambahProduk(
        produk.nama,
        produk.id
    );

}


// =========================
// KURANGI JUMLAH
// =========================

function kurangiProdukById(id){

    const produk = window.semuaProduk.find(
        p => String(p.id) === String(id)
    );

    if(!produk) return;

    kurangiProduk(
        produk.nama,
        produk.id
    );

}


// =========================
// FILTER KATEGORI
// =========================

function buatFilter(products){

    const filter =
        document.getElementById("filterKategori");

    const kategori = [
        ...new Set(
            products
                .map(p => p.kategori)
                .filter(k => k)
        )
    ];

    filter.innerHTML =

    `<button
        class="filter-btn active"
        onclick="filterProduk('Semua',this)"
    >
        Semua
    </button>`;

    kategori.forEach(k => {

        filter.innerHTML +=

        `<button
            class="filter-btn"
            onclick="filterProduk('${k}',this)"
        >
            ${k}
        </button>`;

    });

}


// =========================
// FILTER PRODUK
// =========================

function filterProduk(kategori, tombol){

    document
        .querySelectorAll(".filter-btn")
        .forEach(btn =>
            btn.classList.remove("active")
        );

    tombol.classList.add("active");

    if(kategori === "Semua"){

        renderProducts(
            window.semuaProduk
        );

    }else{

        renderProducts(

            window.semuaProduk.filter(
                p => p.kategori === kategori
            )

        );

    }

}
