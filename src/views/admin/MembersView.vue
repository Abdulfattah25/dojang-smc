<template>
  <div class="space-y-5 sm:space-y-6">
    <!-- Heading -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-brand whitespace-nowrap">
          Master Data Anggota
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
          Kelola biodata, tingkatan sabuk, dan status keaktifan murid.
        </p>
      </div>
    </div>

    <!-- 4 Summary KPI Cards (Modern & Stylish) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4.5">
      <!-- Card 1: Total Anggota -->
      <div class="group relative bg-white border border-slate-200/90 rounded-xl p-3.5 sm:p-5 overflow-hidden shadow-2xs hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200 ease-out flex flex-col justify-between">
        <div class="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-slate-400 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
        <div class="pointer-events-none absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-slate-300/20 blur-xl group-hover:bg-slate-300/35 transition-all duration-300"></div>
        <Users class="pointer-events-none absolute -right-2 -bottom-2 w-16 h-16 text-slate-600/5 group-hover:text-slate-600/10 group-hover:scale-110 transition-all duration-300" />

        <div>
          <div class="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
              Total Siswa
            </span>
            <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-slate-200/70 transition-all duration-200">
              <Users class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p class="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-slate-950 font-mono tracking-tight tabular-nums whitespace-nowrap transition-colors">
            {{ stats.total }}
          </p>
        </div>

        <div class="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
          <span class="truncate">Seluruh murid terdata</span>
        </div>
      </div>

      <!-- Card 2: Anggota Terverifikasi -->
      <div class="group relative bg-white border border-slate-200/90 rounded-xl p-3.5 sm:p-5 overflow-hidden shadow-2xs hover:shadow-md hover:border-amber-300 hover:-translate-y-0.5 transition-all duration-200 ease-out flex flex-col justify-between">
        <div class="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#C9A85B] to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
        <div class="pointer-events-none absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-[#C9A85B]/10 blur-xl group-hover:bg-[#C9A85B]/20 transition-all duration-300"></div>
        <ShieldCheck class="pointer-events-none absolute -right-2 -bottom-2 w-16 h-16 text-[#8C6918]/5 group-hover:text-[#8C6918]/10 group-hover:scale-110 transition-all duration-300" />

        <div>
          <div class="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
              Anggota Aktif
            </span>
            <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 border border-amber-300/60 text-[#8C6918] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-amber-500/15 transition-all duration-200">
              <ShieldCheck class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p class="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-[#8C6918] font-mono tracking-tight tabular-nums whitespace-nowrap transition-colors">
            {{ stats.verified }}
          </p>
        </div>

        <div class="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span class="w-1.5 h-1.5 rounded-full bg-[#C9A85B] shrink-0"></span>
          <span class="truncate">Terverifikasi pelatih</span>
        </div>
      </div>

      <!-- Card 3: Iuran Lunas -->
      <div class="group relative bg-white border border-slate-200/90 rounded-xl p-3.5 sm:p-5 overflow-hidden shadow-2xs hover:shadow-md hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-200 ease-out flex flex-col justify-between">
        <div class="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
        <div class="pointer-events-none absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-emerald-400/10 blur-xl group-hover:bg-emerald-400/20 transition-all duration-300"></div>
        <CreditCard class="pointer-events-none absolute -right-2 -bottom-2 w-16 h-16 text-emerald-600/5 group-hover:text-emerald-600/10 group-hover:scale-110 transition-all duration-300" />

        <div>
          <div class="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
              Iuran Lunas
            </span>
            <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-emerald-100/80 transition-all duration-200">
              <CreditCard class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p class="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-emerald-600 font-mono tracking-tight tabular-nums whitespace-nowrap transition-colors">
            {{ stats.paid }}
          </p>
        </div>

        <div class="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
          <span class="truncate">Pembayaran tercatat</span>
        </div>
      </div>

      <!-- Card 4: Belum Bayar -->
      <div class="group relative bg-white border border-slate-200/90 rounded-xl p-3.5 sm:p-5 overflow-hidden shadow-2xs hover:shadow-md hover:border-red-300 hover:-translate-y-0.5 transition-all duration-200 ease-out flex flex-col justify-between">
        <div class="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-satria-red to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
        <div class="pointer-events-none absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-satria-red/10 blur-xl group-hover:bg-satria-red/20 transition-all duration-300"></div>
        <AlertCircle class="pointer-events-none absolute -right-2 -bottom-2 w-16 h-16 text-satria-red/5 group-hover:text-satria-red/10 group-hover:scale-110 transition-all duration-300" />

        <div>
          <div class="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
              Belum Bayar
            </span>
            <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-50 border border-red-200 text-satria-red flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-red-100/80 transition-all duration-200">
              <AlertCircle class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p class="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-satria-red font-mono tracking-tight tabular-nums whitespace-nowrap transition-colors">
            {{ stats.unpaid }}
          </p>
        </div>

        <div class="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span class="w-1.5 h-1.5 rounded-full bg-satria-red shrink-0"></span>
          <span class="truncate">Tunggakan iuran / formulir</span>
        </div>
      </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-2xs flex flex-col md:flex-row items-center gap-2.5 sm:gap-3">
      <!-- Search Input -->
      <div class="relative w-full md:flex-1">
        <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          v-model="filters.search"
          @input="debounceSearch"
          placeholder="Cari nama, kode TKD, atau nomor HP..."
          class="w-full h-10 sm:h-11 pl-9 pr-8 bg-slate-50 border border-slate-200 rounded-[6px] text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red transition-colors"
        />
        <button
          v-if="filters.search"
          type="button"
          @click="filters.search = ''; onFilterChange()"
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
          title="Hapus pencarian"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Dropdown Filters: 2 kolom di mobile (grid grid-cols-2), flex row di desktop (md:flex md:w-auto) -->
      <div class="grid grid-cols-2 gap-2 w-full md:flex md:w-auto md:gap-3">
        <!-- Belt Filter -->
        <div class="w-full md:w-48">
          <select
            v-model="filters.belt"
            @change="onFilterChange"
            class="w-full h-10 sm:h-11 px-2.5 sm:px-3 bg-slate-50 border border-slate-200 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red transition-colors"
          >
            <option value="">Semua Sabuk</option>
            <option value="Putih">Sabuk Putih</option>
            <option value="Kuning Polos">Sabuk Kuning</option>
            <option value="Hijau Polos">Sabuk Hijau</option>
            <option value="Biru Polos">Sabuk Biru</option>
            <option value="Merah Polos">Sabuk Merah</option>
            <option value="Hitam / Poom">Sabuk Hitam</option>
          </select>
        </div>

        <!-- Payment Status Filter -->
        <div class="w-full md:w-48">
          <select
            v-model="filters.payStatus"
            @change="onFilterChange"
            class="w-full h-10 sm:h-11 px-2.5 sm:px-3 bg-slate-50 border border-slate-200 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red transition-colors"
          >
            <option value="">Status Pembayaran</option>
            <option value="paid">Lunas</option>
            <option value="unpaid">Belum Bayar</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Members Table & Mobile Card List -->
    <div class="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
      <div v-if="loading && !members.length" class="p-12 text-center text-slate-500 text-xs">
        <Loader2 class="w-6 h-6 animate-spin text-satria-red mx-auto mb-2" />
        <span>Memuat data anggota...</span>
      </div>

      <div v-else-if="!members.length" class="p-12 text-center text-slate-500 text-xs">
        Tidak ditemukan data anggota yang cocok dengan filter pencarian.
      </div>

      <div v-else>
        <!-- Desktop Table View (Hidden on mobile) -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50/90 text-slate-500 border-b border-slate-200 font-mono tracking-wider uppercase text-xs">
                <th class="p-3.5 pl-5">Anggota</th>
                <th class="p-3.5">Gender / Tgl Lahir</th>
                <th class="p-3.5">WhatsApp / Alamat</th>
                <th class="p-3.5">Sabuk</th>
                <th class="p-3.5">Status Pembayaran</th>
                <th class="p-3.5 pr-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr
                v-for="m in members"
                :key="m.id"
                class="hover:bg-slate-50/70 transition-colors"
              >
                <td class="p-3.5 pl-5">
                  <div class="flex items-center gap-3 min-w-0">
                    <!-- Profile Avatar -->
                    <div class="relative shrink-0">
                      <img
                        v-if="m.doc_photo_key && !avatarErrors[m.id]"
                        :src="'/api/admin/documents/' + m.doc_photo_key"
                        @error="avatarErrors[m.id] = true"
                        :alt="m.full_name"
                        class="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs"
                      />
                      <div
                        v-else
                        class="w-9 h-9 rounded-full bg-satria-red/10 border border-satria-red/20 text-satria-red flex items-center justify-center font-bold font-mono text-xs shrink-0 shadow-2xs"
                      >
                        {{ m.full_name?.charAt(0) || 'A' }}
                      </div>
                    </div>
                    <div class="min-w-0">
                      <span class="font-mono text-[#8C6918] font-bold block text-xs whitespace-nowrap">{{ m.registration_code }}</span>
                      <span class="text-slate-900 font-semibold text-xs sm:text-sm block truncate">{{ m.full_name }}</span>
                    </div>
                  </div>
                </td>

                <td class="p-3.5">
                  <span class="whitespace-nowrap">{{ m.gender }}</span>
                  <span class="block text-slate-500 font-mono whitespace-nowrap">{{ m.birth_date }}</span>
                </td>

                <td class="p-3.5 max-w-[200px]">
                  <a
                    :href="'https://wa.me/' + cleanPhone(m.phone_number)"
                    target="_blank"
                    class="text-emerald-700 hover:underline font-mono font-medium whitespace-nowrap"
                  >
                    {{ m.phone_number }}
                  </a>
                  <span class="block text-slate-500 truncate text-[11px]">{{ m.address }}</span>
                </td>

                <td class="p-3.5">
                  <span class="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 font-semibold font-mono text-[11px] whitespace-nowrap">
                    {{ m.belt_rank || 'Putih' }}
                  </span>
                </td>

                <td class="p-3.5">
                  <StatusBadge :status="m.payment_status" type="payment" />
                </td>

                <td class="p-3.5 pr-5 text-right">
                  <div class="inline-flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      @click="openDocumentPreview(m)"
                      class="p-1.5 text-slate-400 hover:text-satria-red hover:bg-slate-100 rounded transition-colors"
                      title="Lihat Akta Kelahiran"
                    >
                      <FileText class="w-4 h-4 text-satria-red" />
                    </button>
                    <button
                      type="button"
                      @click="editMember(m)"
                      class="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                      title="Ubah Biodata"
                    >
                      <Edit3 class="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      @click="deleteMember(m.id)"
                      class="p-1.5 text-slate-400 hover:text-satria-red hover:bg-red-50 rounded transition-colors"
                      title="Hapus Anggota"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Proportional Card List (Visible only on mobile) -->
        <div class="md:hidden divide-y divide-slate-100">
          <div
            v-for="m in members"
            :key="m.id"
            class="p-3.5 sm:p-4 space-y-2.5 hover:bg-slate-50/70 transition-colors"
          >
            <!-- Card Header: Avatar, Code, Name, Actions -->
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2.5 min-w-0">
                <!-- Profile Avatar -->
                <div class="relative shrink-0">
                  <img
                    v-if="m.doc_photo_key && !avatarErrors[m.id]"
                    :src="'/api/admin/documents/' + m.doc_photo_key"
                    @error="avatarErrors[m.id] = true"
                    :alt="m.full_name"
                    class="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs"
                  />
                  <div
                    v-else
                    class="w-9 h-9 rounded-full bg-satria-red/10 border border-satria-red/20 text-satria-red flex items-center justify-center font-bold font-mono text-xs shrink-0 shadow-2xs"
                  >
                    {{ m.full_name?.charAt(0) || 'A' }}
                  </div>
                </div>
                <div class="min-w-0">
                  <span class="font-semibold text-slate-900 text-xs sm:text-sm truncate block mt-0.5">{{ m.full_name }}</span>
                </div>
              </div>
              <div class="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  @click="openDocumentPreview(m)"
                  class="p-1.5 text-slate-400 hover:text-satria-red hover:bg-slate-100 rounded transition-colors"
                  title="Lihat Akta Kelahiran"
                >
                  <FileText class="w-4 h-4 text-satria-red" />
                </button>
                <button
                  type="button"
                  @click="editMember(m)"
                  class="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                  title="Ubah Biodata"
                >
                  <Edit3 class="w-4 h-4" />
                </button>
                <button
                  type="button"
                  @click="deleteMember(m.id)"
                  class="p-1.5 text-slate-400 hover:text-satria-red hover:bg-red-50 rounded transition-colors"
                  title="Hapus Anggota"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Card Badges & Belt -->
            <div class="flex items-center gap-2 flex-wrap text-xs">
              <span class="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 font-semibold font-mono text-[11px] whitespace-nowrap">
                Sabuk: {{ m.belt_rank || 'Putih' }}
              </span>
              <StatusBadge :status="m.payment_status" type="payment" />
            </div>

            <!-- Card Info Details -->
            <div class="flex items-center justify-between gap-2 text-xs text-slate-500 font-mono flex-wrap">
              <span class="whitespace-nowrap">{{ m.gender }} • {{ m.birth_date }}</span>
              <a
                :href="'https://wa.me/' + cleanPhone(m.phone_number)"
                target="_blank"
                class="text-emerald-700 font-medium hover:underline whitespace-nowrap"
              >
                {{ m.phone_number }}
              </a>
            </div>

            <p class="text-xs text-slate-500 truncate font-sans">{{ m.address }}</p>
          </div>
        </div>

        <!-- Pagination Toolbar -->
        <div
          v-if="members.length > 0"
          class="p-3 sm:px-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
        >
          <div class="text-slate-500 whitespace-nowrap order-2 sm:order-1">
            Menampilkan <span class="font-semibold text-slate-800 font-mono">{{ startRecord }}</span> - <span class="font-semibold text-slate-800 font-mono">{{ endRecord }}</span> dari <span class="font-semibold text-slate-800 font-mono">{{ totalRecords }}</span> anggota
          </div>

          <div class="flex items-center gap-1.5 order-1 sm:order-2">
            <button
              type="button"
              @click="currentPage--"
              :disabled="currentPage <= 1"
              class="h-8 px-2.5 rounded-[5px] bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors whitespace-nowrap"
            >
              <ChevronLeft class="w-3.5 h-3.5" />
              <span class="hidden sm:inline">Sebelumnya</span>
            </button>
            
            <div class="flex items-center gap-1 font-mono">
              <button
                v-for="page in totalPages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'w-8 h-8 rounded-[5px] font-semibold transition-colors flex items-center justify-center',
                  currentPage === page
                    ? 'bg-satria-red text-white font-bold shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                ]"
              >
                {{ page }}
              </button>
            </div>

            <button
              type="button"
              @click="currentPage++"
              :disabled="currentPage >= totalPages"
              class="h-8 px-2.5 rounded-[5px] bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors whitespace-nowrap"
            >
              <span class="hidden sm:inline">Selanjutnya</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Member Modal -->
    <div
      v-if="editingMember"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
    >
      <div class="w-full max-w-lg bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xl text-slate-800">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 class="font-bold text-base text-slate-900">Edit Data Anggota</h3>
            <span class="text-xs font-mono text-[#8C6918]">{{ editingForm.registration_code }}</span>
          </div>
          <button @click="editingMember = null" class="text-slate-400 hover:text-slate-700">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="saveMemberEdit" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              v-model="editingForm.full_name"
              required
              class="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
              <input
                type="date"
                v-model="editingForm.birth_date"
                required
                class="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
              <select
                v-model="editingForm.gender"
                class="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp</label>
            <input
              type="text"
              v-model="editingForm.phone_number"
              required
              class="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Alamat Domisili</label>
            <textarea
              v-model="editingForm.address"
              rows="2"
              class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Tingkatan Sabuk</label>
              <select
                v-model="editingForm.belt_rank"
                class="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red"
              >
                <option value="Putih">Sabuk Putih</option>
                <option value="Kuning Polos">Kuning Polos</option>
                <option value="Kuning Strip">Kuning Strip</option>
                <option value="Hijau Polos">Hijau Polos</option>
                <option value="Hijau Strip">Hijau Strip</option>
                <option value="Biru Polos">Biru Polos</option>
                <option value="Biru Strip">Biru Strip</option>
                <option value="Merah Polos">Merah Polos</option>
                <option value="Merah Strip 1">Merah Strip 1</option>
                <option value="Merah Strip 2">Merah Strip 2</option>
                <option value="Hitam / Poom">Hitam / Poom</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Status Pembayaran</label>
              <select
                v-model="editingForm.payment_status"
                class="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red"
              >
                <option value="paid">Lunas</option>
                <option value="unpaid">Belum Bayar</option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              @click="editingMember = null"
              class="px-4 h-9 border border-slate-300 rounded-[6px] text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-[6px] flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Loader2 v-if="saving" class="w-3.5 h-3.5 animate-spin" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Document Modal -->
    <DocumentModal
      :is-open="modalOpen"
      :doc-key="selectedDocKey"
      :member="selectedMember"
      @close="closeModal"
    />

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { apiRequest } from '../../utils/api.js';
import { showConfirm, toastSuccess, toastError } from '../../utils/swal.js';
import {
  RefreshCw,
  Search,
  Loader2,
  Edit3,
  Trash2,
  X,
  Users,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-vue-next';
import DocumentModal from '../../components/DocumentModal.vue';
import StatusBadge from '../../components/common/StatusBadge.vue';

const members = ref([]);
const loading = ref(false);
const saving = ref(false);

const currentPage = ref(1);
const pageSize = ref(8);
const totalRecords = ref(0);
const avatarErrors = reactive({});

const stats = reactive({
  total: 0,
  verified: 0,
  paid: 0,
  unpaid: 0,
});

const filters = reactive({
  search: '',
  belt: '',
  payStatus: '',
});

const totalPages = computed(() => Math.max(1, Math.ceil(totalRecords.value / pageSize.value)));

const startRecord = computed(() => totalRecords.value === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1);
const endRecord = computed(() => Math.min(currentPage.value * pageSize.value, totalRecords.value));

watch(currentPage, () => {
  fetchMembers();
});

function onFilterChange() {
  currentPage.value = 1;
  fetchMembers();
}

const editingMember = ref(null);
const modalOpen = ref(false);
const selectedDocKey = ref('');
const selectedMember = ref(null);

function openDocumentPreview(member) {
  selectedMember.value = member;
  selectedDocKey.value = member.doc_birth_cert_key;
  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
  selectedDocKey.value = '';
  selectedMember.value = null;
}
const editingForm = reactive({
  id: null,
  registration_code: '',
  full_name: '',
  birth_date: '',
  gender: '',
  phone_number: '',
  address: '',
  belt_rank: '',
  registration_status: '',
  payment_status: '',
});

let debounceTimer = null;
function debounceSearch() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    currentPage.value = 1;
    fetchMembers();
  }, 350);
}

async function fetchMembers() {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    params.append('page', String(currentPage.value));
    params.append('limit', String(pageSize.value));
    if (filters.search) params.append('search', filters.search);
    if (filters.belt) params.append('belt', filters.belt);
    if (filters.payStatus) params.append('payment_status', filters.payStatus);

    const data = await apiRequest(`/api/admin/members?${params.toString()}`);
    members.value = data.members || [];
    totalRecords.value = data.total || 0;
    if (data.stats) {
      Object.assign(stats, data.stats);
    }
  } catch (err) {
    toastError(err.message || 'Gagal memuat data anggota.');
  } finally {
    loading.value = false;
  }
}

function editMember(m) {
  editingMember.value = m;
  Object.assign(editingForm, {
    id: m.id,
    registration_code: m.registration_code,
    full_name: m.full_name,
    birth_date: m.birth_date,
    gender: m.gender,
    phone_number: m.phone_number,
    address: m.address,
    belt_rank: m.belt_rank || 'Putih',
    registration_status: m.registration_status,
    payment_status: m.payment_status,
  });
}

async function saveMemberEdit() {
  saving.value = true;
  try {
    await apiRequest(`/api/admin/members/${editingForm.id}`, {
      method: 'PUT',
      body: editingForm,
    });
    editingMember.value = null;
    toastSuccess('Perubahan data anggota berhasil disimpan!');
    await fetchMembers();
  } catch (err) {
    toastError(err.message || 'Gagal menyimpan perubahan.');
  } finally {
    saving.value = false;
  }
}

async function deleteMember(id) {
  const confirmed = await showConfirm({
    title: 'Hapus Data Anggota?',
    text: 'Data anggota beserta seluruh berkasnya akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.',
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#dc2626',
    icon: 'warning',
  });
  if (!confirmed) return;

  try {
    await apiRequest(`/api/admin/members/${id}`, { method: 'DELETE' });
    toastSuccess('Data anggota berhasil dihapus.');
    await fetchMembers();
  } catch (err) {
    toastError(err.message || 'Gagal menghapus data anggota.');
  }
}

function cleanPhone(phone) {
  if (!phone) return '';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  return cleaned;
}

onMounted(() => {
  fetchMembers();
});
</script>
