fetch("https://script.google.com/macros/s/AKfycbyuJnpSAJmwAMLdMhEN26hsibAShv1z8uQOsvGw80GRrcf9zr0RPJbC6fe5nhzppnlc1g/exec")
.then(res => res.json())
.then(products => {

    const grid = document.getElementById("productGrid");

    grid.innerHTML = "";

    window.semuaProduk=products;

    buatFilter(products);

    renderProducts(products);

})
.catch(err => console.error(err));

 function formatHarga(harga){

        if(!harga) return "-";

        const text = harga.toString();

        const match = text.match(/^(\d+)(.*)$/);

        if(!match) return "Rp" + text;

        const angka = Number(match[1]).toLocaleString("id-ID");

        return "Rp" + angka + match[2];

    }

function renderProducts(products){

    const grid = document.getElementById("productGrid");

    grid.innerHTML = "";

    products.forEach(produk=>{

        const gambar = produk.gambar
        ? `image produk/${produk.gambar}`
        : "image produk/no-image.png";

        grid.innerHTML += `
        <div class="product-card">

            ${produk.hargaCoret > 0 ? `
            <div class="promo-badge">
                🔥 PROMO
            </div>
            ` : ""}

            <img src="${gambar}" class="product-image">

            <div class="product-name">
                ${produk.nama}
            </div>

           ${produk.hargaCoret > 0 ? `
        <div class="product-old-price">
            ${formatHarga(produk.hargaCoret)}
        </div>
        ` : ""}

        <div class="product-price">
           ${formatHarga(produk.harga)}
        </div>

            <div class="cart-action">

                <button class="cart-btn"
                onclick="tambahKeranjang('${produk.nama}',${produk.harga},'${produk.id}')">

                    🛒 Tambah

                </button>

                <div class="qty-control" id="qty-${produk.id}" style="display:none;">

                    <button onclick="kurangiProduk('${produk.nama}','${produk.id}')">−</button>

                    <span>0</span>

                    <button onclick="tambahProduk('${produk.nama}','${produk.id}')">+</button>

                </div>

            </div>

        </div>
        `;

        updateQty(produk.id,produk.nama);

    });

}

function buatFilter(products){

    const filter=document.getElementById("filterKategori");

    const kategori=[
        ...new Set(products.map(p=>p.kategori))
    ];

    filter.innerHTML=
    `<button class="filter-btn active"
    onclick="filterProduk('Semua',this)">
    Semua
    </button>`;

    kategori.forEach(k=>{

        filter.innerHTML+=
        `<button class="filter-btn"
        onclick="filterProduk('${k}',this)">
        ${k}
        </button>`;

    });

}

function filterProduk(kategori,tombol){

    document.querySelectorAll(".filter-btn")
    .forEach(btn=>btn.classList.remove("active"));

    tombol.classList.add("active");

    if(kategori==="Semua"){

        renderProducts(window.semuaProduk);

    }else{

        renderProducts(

            window.semuaProduk.filter(
                p=>p.kategori===kategori
            )

        );

    }

}
