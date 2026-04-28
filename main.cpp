#include <iostream>
#include "sqlite3.h"

using namespace std;


void tambahTugas(sqlite3 *db) {
    string judul, deadline;

    cin.ignore();

    cout << "Masukkan judul tugas   : ";
    getline(cin, judul);

    cout << "Masukkan deadline      : ";
    getline(cin, deadline);

    string sql = "INSERT INTO tasks (judul, deadline, status) VALUES ('" 
                + judul + "', '" + deadline + "', 'Belum');";

    char *errMsg = 0;

    if (sqlite3_exec(db, sql.c_str(), 0, 0, &errMsg) != SQLITE_OK) {
        cout << "❌ Gagal tambah tugas\n";
        sqlite3_free(errMsg);
    } else {
        cout << "✅ Tugas berhasil ditambahkan!\n";
    }
}


int callback(void *NotUsed, int argc, char **argv, char **azColName) {
    cout << "----------------------------------------\n";
    cout << "ID       : " << (argv[0] ? argv[0] : "NULL") << endl;
    cout << "Judul    : " << (argv[1] ? argv[1] : "NULL") << endl;
    cout << "Deadline : " << (argv[2] ? argv[2] : "NULL") << endl;
    cout << "Status   : " << (argv[3] ? argv[3] : "NULL") << endl;
    return 0;
}


void tampilkanTugas(sqlite3 *db) {
    const char *sql = "SELECT * FROM tasks;";
    char *errMsg = 0;

    cout << "\n========== DAFTAR TUGAS ==========\n";

    if (sqlite3_exec(db, sql, callback, 0, &errMsg) != SQLITE_OK) {
        cout << "❌ Gagal menampilkan data\n";
        sqlite3_free(errMsg);
    }

    cout << "----------------------------------------\n";
}


void hapusTugasTerakhir(sqlite3 *db) {
    char *errMsg = 0;

    const char *sqlGet = "SELECT id FROM tasks ORDER BY id DESC LIMIT 1;";
    sqlite3_stmt *stmt;

    int rc = sqlite3_prepare_v2(db, sqlGet, -1, &stmt, NULL);

    if (rc != SQLITE_OK) {
        cout << "❌ Gagal mengambil data\n";
        return;
    }

    rc = sqlite3_step(stmt);

    if (rc == SQLITE_ROW) {
        int id = sqlite3_column_int(stmt, 0);

        string sqlDelete = "DELETE FROM tasks WHERE id = " + to_string(id) + ";";

        if (sqlite3_exec(db, sqlDelete.c_str(), 0, 0, &errMsg) != SQLITE_OK) {
            cout << "❌ Gagal menghapus tugas\n";
        } else {
            cout << "🗑️ Tugas terakhir berhasil dihapus!\n";
        }
    } else {
        cout << "⚠️ Tidak ada tugas untuk dihapus\n";
    }

    sqlite3_finalize(stmt);
}


void ubahStatus(sqlite3 *db) {
    int id, pilihan;

    cout << "Masukkan ID tugas: ";
    cin >> id;

    cout << "Pilih status:\n";
    cout << "1. Belum\n";
    cout << "2. Selesai\n";
    cout << "Pilih: ";
    cin >> pilihan;

    string status;

    if (pilihan == 1)
        status = "Belum";
    else if (pilihan == 2)
        status = "Selesai";
    else {
        cout << "❌ Pilihan tidak valid!\n";
        return;
    }

    string sql = "UPDATE tasks SET status = '" + status + "' WHERE id = " + to_string(id) + ";";

    char *errMsg = 0;

    if (sqlite3_exec(db, sql.c_str(), 0, 0, &errMsg) != SQLITE_OK) {
        cout << "❌ Gagal update status\n";
    } else {
        cout << "✅ Status berhasil diubah!\n";
    }
}


int main() {
    sqlite3 *db;
    char *errMsg = 0;

    int rc = sqlite3_open("test.db", &db);

    if (rc) {
        cout << "❌ Gagal membuka database\n";
        return 0;
    } else {
        cout << "✅ Database berhasil dibuka!\n";
    }

    // ===== BUAT TABEL =====
    const char *sql =
        "CREATE TABLE IF NOT EXISTS tasks ("
        "id INTEGER PRIMARY KEY AUTOINCREMENT,"
        "judul TEXT,"
        "deadline TEXT,"
        "status TEXT);";

    rc = sqlite3_exec(db, sql, 0, 0, &errMsg);

    if (rc != SQLITE_OK) {
        cout << "❌ Gagal membuat tabel\n";
    } else {
        cout << "📦 Tabel siap digunakan!\n";
    }

    
    int pilihan;

    do {
        cout << "\n========== MENU REMINDER ==========\n";
        cout << "1. Tambah Tugas\n";
        cout << "2. Tampilkan Tugas\n";
        cout << "3. Hapus Tugas Terakhir (STACK)\n";
        cout << "4. Ubah Status Tugas\n";
        cout << "5. Keluar\n";
        cout << "Pilih: ";
        cin >> pilihan;

        switch (pilihan) {
            case 1:
                tambahTugas(db);
                break;
            case 2:
                tampilkanTugas(db);
                break;
            case 3:
                hapusTugasTerakhir(db);
                break;
            case 4:
                ubahStatus(db);
                break;
        }

    } while (pilihan != 5);

    sqlite3_close(db);
    return 0;
}
