// Thư viện node: http, fs (CRUD)
const http = require("http");
const fs = require("fs");
// Khai báo cổng dịch vụ
const port = 8080;
// Xây dựng Dịch vụ
const server = http.createServer((req, res) => {
    let method = req.method;
    let url = req.url;
    let kq = `Server Node - Method:${method} - Url:${url}`;
    let noi_dung_nhan = ``;
    switch (method) {
        case "GET":
            if (url == "/listTivi") {
                kq = fs.readFileSync("./data/Tivi.json", "utf8");
                res.writeHead(200, { "Content-type": "text/json;charset=utf8" });
            } else if (url == "/listMobile") {
                kq = fs.readFileSync("./data/Dien_thoai.json", "utf8");
                res.writeHead(200, { "Content-type": "text/json;charset=utf8" });
            } else if (url == "/listUser") {
                kq = fs.readFileSync("./data/Nguoi_dung.json", "utf8");
                res.writeHead(200, { "Content-type": "text/json;charset=utf8" });
            } else if (url.match("\.png$")) {
                console.log(url);
                let imagePath = `./images/${url}`;
                if (!fs.existsSync(imagePath)) {
                    imagePath = `./images/noImage.png`;
                }
                let fileStream = fs.createReadStream(imagePath);
                res.writeHead(200, { "Content-Type": "image/png" });
                fileStream.pipe(res);
                return;
            }
            res.end(kq);
            break;
        case "POST":
            // Lấy nội dung gởi từ client về server

            req.on("data", (data) => {
                noi_dung_nhan += data;
            })
            if (url == "/insertUser") {
                req.on("end", () => {
                    let strJson = fs.readFileSync("./data/Nguoi_dung.json", "utf8");
                    let dsUser = JSON.parse(strJson);
                    let user = JSON.parse(noi_dung_nhan);
                    dsUser.push(user);
                    fs.writeFileSync("./data/Nguoi_dung.json", JSON.stringify(dsUser), "utf8");
                    let kq = { "noi_dung": true }
                    res.end(JSON.stringify(kq));

                })
            }
            break;
        case "PUT":
            // Lấy nội dung gởi từ client về server
            noi_dung_nhan = ``;
            req.on("data", (data) => {
                noi_dung_nhan += data;
            })
            if (url == "/updateUser") {
                req.on("end", () => {
                    let strJson = fs.readFileSync("./data/Nguoi_dung.json", "utf8");
                    let dsUser = JSON.parse(strJson);
                    let user = JSON.parse(noi_dung_nhan);
                    let tmp = dsUser.find(item => item.Ma_so == user.Ma_so);
                    tmp.Ho_ten = user.Ho_ten;
                    tmp.Ten_Dang_nhap = user.Ten_Dang_nhap;
                    tmp.Mat_khau = user.Mat_khau;
                    fs.writeFileSync("./data/Nguoi_dung.json", JSON.stringify(dsUser), "utf8");
                    let kq = { "noi_dung": true }
                    res.end(JSON.stringify(kq));
                })
            }
            break;
        case "DELETE":
            // Lấy nội dung gởi từ client về server
            noi_dung_nhan = ``;
            req.on("data", (data) => {
                noi_dung_nhan += data;
            })
            if (url == "/deleteUser") {
                req.on("end", () => {
                    let strJson = fs.readFileSync("./data/Nguoi_dung.json", "utf8");
                    let dsUser = JSON.parse(strJson);
                    let user = JSON.parse(noi_dung_nhan);
                    let vtXoa = dsUser.findIndex(item => item.Ma_so == user.Ma_so);
                    dsUser.splice(vtXoa, 1);
                    fs.writeFileSync("./data/Nguoi_dung.json", JSON.stringify(dsUser), "utf8");
                    let kq = { "noi_dung": true }
                    res.end(JSON.stringify(kq));
                })
            }

            break;
        default:
            break;
    }

});

server.listen(port, () => {
    console.log(`Server run http://localhost:${port}`);
}
)



