const html_to_pdf = require("html-pdf-node");
const { Readable } = require("stream");

const generatePDF = (req, res) => {
  const { content } = req.body;
  console.log("content", content);
  let dateNow = new Date();
  if (!content) {
    return res.status(400).json({ error: "HTML content is required" });
  }
  let totalMontantSansTVA = content.reduce((total, item) => {
    return (
      total +
      item.products.reduce((subtotal, product) => {
        return subtotal + product.quantite * product.prixVenteHT;
      }, 0)
    );
  }, 0);
  let totalMontantAvecTVA = content.reduce((total, item) => {
    return (
      total +
      item.products.reduce((subtotal, product) => {
        return (
          subtotal +
          product.quantite *
            (product.prixVenteHT * 1.19 +
              (product.prixVenteHT * product.MargeHT) / 100)
        );
      }, 0)
    );
  }, 0);

  let remise = content[0].giveRemise ? parseFloat(content[0].Remise) : 0;
  let timbreFiscal = content[0].timbreFiscal ? 1 : 0;

  let totalMontantAvecTVAetRemise =
    totalMontantSansTVA * 1.19 +
    timbreFiscal -
    ((totalMontantSansTVA * 1.19 + timbreFiscal) * remise) / 100;

  let tauxTva = totalMontantAvecTVA - totalMontantSansTVA;

  let options = { format: "A4" };
  let f = {
    content: `
        <div class="container">
      
        <div class="invoice">
        <div class="head">
        <div class="box">
        <div style="text-align: center"><h3>Détails Facture</h3></div>
        <h3>Num Facture :  ${content[0].count}</h3>
        <p>Client : ${content[0].to} </p>
        <p>Methode de paiement: ${content[0].PaimentMethod}</p>
        <p>Facturé le : ${dateNow.getDate()}/${dateNow.getMonth()}/${dateNow.getFullYear()}</p>
      </div>
      <div class="box">
        <div style="text-align: center"><h3>Détails société</h3></div>
        <h3>Nom : BOUSSADA AUTO</h3>
        <p>Adresse : 28 Avenue hadi chaker 1002 Tunis</p>
        <p>Numero de téléphone : +216 99 573 845 | +216 99 573 845</p>
        <p>Adresse Email : hamidoboussada23@gmail.com</p>
        <p>Matricule fiscal : 1275891C/B/M 000</p>
        <p>Rib : 123456789123456789123456</p>
      </div>
        </div>
        <div class="invoice-body">
          <div style="text-align: center;"><h3>Products</h3></div>
          <table>
            <tr>
              <th>Code</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Quantite</th>
              <th>Prix Vente HT</th>
              <th>Montant</th>
            </tr>
            ${content
              .map((item) =>
                item.products
                  .map(
                    (product) => `
                        <tr>
                        <td>${product.code}</td>
                          <td>${product.name}</td>
                          <td>${product.category}</td>
                          <td>${product.quantite}</td>
                          <td>${product.prixVenteHT}</td>
                          <td> ${(
                            product.quantite * product.prixVenteHT
                          ).toFixed(3)}</td>
                        
                        </tr>
                      `
                  )
                  .join("")
              )
              .join("")}
            </table>    
          <div class="total">
            <h3 style="margin-right: 10px;">TOTAL :  ${totalMontantSansTVA.toFixed(
              3
            )} TND</h3>
          </div>
        </div>
        <div class="invoice-footer">
          <div class="footer-left">
            <div>
              <h3>Base de calcule de la TVA pour les frais (TND)</h3>
              <table>
                <tr>
                  <th>BASE TVA</th>
                  <th>TAUX TVA</th>
                  <th>Remise</th>
                </tr>
                <tr>
                  <td style="text-align: center">19 %</td>
                  <td> ${tauxTva.toFixed(3)} TND</td>
                   ${
                     content[0].giveRemise
                       ? `<td>${content[0].Remise}%</td>`
                       : `<td>0%</td>`
                   }
                </tr>
              </table>
            </div>
            
          </div>
          <div class="footer-right">
            <div class="payment">
              <div>
                <h3>Montant Principal</h3>
                <h3>Timbre Fiscal</h3>
                <h3>Montant général</h3>
              </div>
              <div>
                <h3>${totalMontantSansTVA.toFixed(3)} TND</h3>
                ${
                  content[0].timbreFiscal
                    ? "<h3>1.000 TND</h3>"
                    : "<h3>0.000 TND</h3>"
                }
                <h3>${totalMontantAvecTVAetRemise.toFixed(3)} TND</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    
      
      </div>
      <style>
      .container {
        margin-top: 100px;
        height: 100%;
      }
      .text-footer {
        width: 80%;
        margin: 0 auto;
        text-align: center;
        margin-top: 50vh;
        font-size: 10px;
      }
      .left-down {
        height: 18vh;
      }
      .footer-right {
        height: 16.05vh;
      }
      .total {
        width: 100%;
        display: grid;
        justify-items: end;
      }
      .head {
        width: 95%;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 2em;
      }
      .payment {
        width: 100%;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
      .payment div {
        min-height: 181px;
        border: 1px solid black;
        padding-left: 10px;
      }

      .box {
        height: 165px;
        border: 2px solid black;
        display: grid;
        grid-template-rows: 2fr 6fr 1fr;
      }
      .box div {
        border: 1px solid black;
      }
      .box h3 {
        margin: 0;
        margin-left: 5px;
      }
      .box p {
        margin: 0;
        margin-left: 5px;
      }

      .invoice-body {
        width: 95%;
        min-height: 220px;
        margin: 0 auto;
        margin-top: 10px;
        border: 2px solid black;
        display: grid;
        grid-template-rows: auto 1fr auto;
      }

      .invoice-body div {
        border: 1px solid black;
      }

      .invoice-body th,
      .invoice-body td {
        padding: 10px;
      }

      .invoice-footer {
        width: 95%;
        height: 50px;
        margin: 0 auto;
        margin-top: 10px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 1em;
      }

      .invoice-footer .footer-right {
        border: 2px solid black;
      }

      .invoice-footer .footer-left {
        display: grid;
        grid-template-rows: 1fr 2fr;
        grid-gap: 1em;
      }

      .invoice-footer .footer-left div {
        border: 2px solid black;
      }
      table,
      td,
      th {
        border: 1px solid black;
        text-align: left;
      }

      table {
        border-collapse: collapse;
        width: 100%;
      }

      th,
      td {
        padding: 15px;
      }
    </style>      `,
  };
  html_to_pdf.generatePdf(f, options).then((pdfBuffer) => {
    var file = Readable.from(pdfBuffer);
    console.log("PDF Buffer:-", pdfBuffer);
    res.setHeader("Content-Length", Buffer.byteLength(pdfBuffer));
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=quote.pdf");
    file.pipe(res);
  });
};
const generatePDFDevis = (req, res) => {
  const { content } = req.body;
  console.log("content", content);
  let dateNow = new Date();
  if (!content) {
    return res.status(400).json({ error: "HTML content is required" });
  }
  let totalMontantSansTVA = content.reduce((total, item) => {
    return (
      total +
      item.products.reduce((subtotal, product) => {
        return subtotal + product.quantite * product.prixVenteHT;
      }, 0)
    );
  }, 0);
  let totalMontantAvecTVA = content.reduce((total, item) => {
    return (
      total +
      item.products.reduce((subtotal, product) => {
        return (
          subtotal +
          product.quantite *
            (product.prixVenteHT * 1.19 +
              (product.prixVenteHT * product.MargeHT) / 100)
        );
      }, 0)
    );
  }, 0);

  let remise = content[0].giveRemise ? parseFloat(content[0].Remise) : 0;
  let timbreFiscal = content[0].timbreFiscal ? 1 : 0;

  let totalMontantAvecTVAetRemise =
    totalMontantSansTVA * 1.19 +
    timbreFiscal -
    ((totalMontantSansTVA * 1.19 + timbreFiscal) * remise) / 100;

  let tauxTva = totalMontantAvecTVA - totalMontantSansTVA;

  let options = { format: "A4" };
  let f = {
    content: `
        <div class="container">
      
        <div class="invoice">
        <div class="head">
        <div class="box">
        <div style="text-align: center"><h3>Détails Devis</h3></div>
        <h3>Num Devis :  ${content[0].count}</h3>
        <p>Client : ${content[0].to} </p>
        <p>Methode de paiement: ${content[0].PaimentMethod}</p>
        <p>Facturé le : ${dateNow.getDate()}/${dateNow.getMonth()}/${dateNow.getFullYear()}</p>
      </div>
      <div class="box">
        <div style="text-align: center"><h3>Détails société</h3></div>
        <h3>Nom : BOUSSADA AUTO</h3>
        <p>Adresse : 28 Avenue hadi chaker 1002 Tunis</p>
        <p>Numero de téléphone : +216 99 573 845 | +216 99 573 845</p>
        <p>Adresse Email : hamidoboussada23@gmail.com</p>
        <p>Matricule fiscal : 1275891C/B/M 000</p>
        <p>Rib : 123456789123456789123456</p>
      </div>
        </div>
        <div class="invoice-body">
          <div style="text-align: center;"><h3>Products</h3></div>
          <table>
            <tr>
              <th>Code</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Quantite</th>
              <th>Prix Vente HT</th>
              <th>Montant</th>
            </tr>
            ${content
              .map((item) =>
                item.products
                  .map(
                    (product) => `
                        <tr>
                        <td>${product.code}</td>
                          <td>${product.name}</td>
                          <td>${product.category}</td>
                          <td>${product.quantite}</td>
                          <td>${product.prixVenteHT}</td>
                          <td> ${(
                            product.quantite * product.prixVenteHT
                          ).toFixed(3)}</td>
                        
                        </tr>
                      `
                  )
                  .join("")
              )
              .join("")}
            </table>    
          <div class="total">
            <h3 style="margin-right: 10px;">TOTAL :  ${totalMontantSansTVA.toFixed(
              3
            )} TND</h3>
          </div>
        </div>
        <div class="invoice-footer">
          <div class="footer-left">
            <div>
              <h3>Base de calcule de la TVA pour les frais (TND)</h3>
              <table>
                <tr>
                  <th>BASE TVA</th>
                  <th>TAUX TVA</th>
                  <th>Remise</th>
                </tr>
                <tr>
                  <td style="text-align: center">19 %</td>
                  <td> ${tauxTva.toFixed(3)} TND</td>
                   ${
                     content[0].giveRemise
                       ? `<td>${content[0].Remise}%</td>`
                       : `<td>0%</td>`
                   }
                </tr>
              </table>
            </div>
            
          </div>
          <div class="footer-right">
            <div class="payment">
              <div>
                <h3>Montant Principal</h3>
                <h3>Timbre Fiscal</h3>
                <h3>Montant général</h3>
              </div>
              <div>
                <h3>${totalMontantSansTVA.toFixed(3)} TND</h3>
                ${
                  content[0].timbreFiscal
                    ? "<h3>1.000 TND</h3>"
                    : "<h3>0.000 TND</h3>"
                }
                <h3>${totalMontantAvecTVAetRemise.toFixed(3)} TND</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    
      
      </div>
      <style>
      .container {
        margin-top: 100px;
        height: 100%;
      }
      .text-footer {
        width: 80%;
        margin: 0 auto;
        text-align: center;
        margin-top: 50vh;
        font-size: 10px;
      }
      .left-down {
        height: 18vh;
      }
      .footer-right {
        height: 16.05vh;
      }
      .total {
        width: 100%;
        display: grid;
        justify-items: end;
      }
      .head {
        width: 95%;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 2em;
      }
      .payment {
        width: 100%;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
      .payment div {
        min-height: 181px;
        border: 1px solid black;
        padding-left: 10px;
      }

      .box {
        height: 165px;
        border: 2px solid black;
        display: grid;
        grid-template-rows: 2fr 6fr 1fr;
      }
      .box div {
        border: 1px solid black;
      }
      .box h3 {
        margin: 0;
        margin-left: 5px;
      }
      .box p {
        margin: 0;
        margin-left: 5px;
      }

      .invoice-body {
        width: 95%;
        min-height: 220px;
        margin: 0 auto;
        margin-top: 10px;
        border: 2px solid black;
        display: grid;
        grid-template-rows: auto 1fr auto;
      }

      .invoice-body div {
        border: 1px solid black;
      }

      .invoice-body th,
      .invoice-body td {
        padding: 10px;
      }

      .invoice-footer {
        width: 95%;
        height: 50px;
        margin: 0 auto;
        margin-top: 10px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 1em;
      }

      .invoice-footer .footer-right {
        border: 2px solid black;
      }

      .invoice-footer .footer-left {
        display: grid;
        grid-template-rows: 1fr 2fr;
        grid-gap: 1em;
      }

      .invoice-footer .footer-left div {
        border: 2px solid black;
      }
      table,
      td,
      th {
        border: 1px solid black;
        text-align: left;
      }

      table {
        border-collapse: collapse;
        width: 100%;
      }

      th,
      td {
        padding: 15px;
      }
    </style>      `,
  };
  html_to_pdf.generatePdf(f, options).then((pdfBuffer) => {
    var file = Readable.from(pdfBuffer);
    console.log("PDF Buffer:-", pdfBuffer);
    res.setHeader("Content-Length", Buffer.byteLength(pdfBuffer));
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=quote.pdf");
    file.pipe(res);
  });
};
const generatePDFBon = (req, res) => {
  const { content } = req.body;
  console.log("content", content);
  let dateNow = new Date();
  if (!content) {
    return res.status(400).json({ error: "HTML content is required" });
  }
  let totalMontantSansTVA = content.reduce((total, item) => {
    return (
      total +
      item.products.reduce((subtotal, product) => {
        return subtotal + product.quantite * product.prixVenteHT;
      }, 0)
    );
  }, 0);
  let totalMontantAvecTVA = content.reduce((total, item) => {
    return (
      total +
      item.products.reduce((subtotal, product) => {
        return (
          subtotal +
          product.quantite *
            (product.prixVenteHT * 1.19 +
              (product.prixVenteHT * product.MargeHT) / 100)
        );
      }, 0)
    );
  }, 0);

  let remise = content[0].giveRemise ? parseFloat(content[0].Remise) : 0;
  let timbreFiscal = content[0].timbreFiscal ? 1 : 0;

  let totalMontantAvecTVAetRemise =
    totalMontantSansTVA * 1.19 +
    timbreFiscal -
    ((totalMontantSansTVA * 1.19 + timbreFiscal) * remise) / 100;

  let tauxTva = totalMontantAvecTVA - totalMontantSansTVA;

  let options = { format: "A4" };
  let f = {
    content: `
        <div class="container">
      
        <div class="invoice">
        <div class="head">
        <div class="box">
        <div style="text-align: center"><h3>Détails bon de livraison</h3></div>
        <h3>Num bon de livraison :  ${content[0].count}</h3>
        <p>Client : ${content[0].to} </p>
        <p>Methode de paiement: ${content[0].PaimentMethod}</p>
        <p>Facturé le : ${dateNow.getDate()}/${dateNow.getMonth()}/${dateNow.getFullYear()}</p>
      </div>
      <div class="box">
        <div style="text-align: center"><h3>Détails société</h3></div>
        <h3>Nom : BOUSSADA AUTO</h3>
        <p>Adresse : 28 Avenue hadi chaker 1002 Tunis</p>
        <p>Numero de téléphone : +216 99 573 845 | +216 99 573 845</p>
        <p>Adresse Email : hamidoboussada23@gmail.com</p>
        <p>Matricule fiscal : 1275891C/B/M 000</p>
        <p>Rib : 123456789123456789123456</p>
      </div>
        </div>
        <div class="invoice-body">
          <div style="text-align: center;"><h3>Products</h3></div>
          <table>
            <tr>
              <th>Code</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Quantite</th>
              <th>Prix Vente HT</th>
              <th>Montant</th>
            </tr>
            ${content
              .map((item) =>
                item.products
                  .map(
                    (product) => `
                        <tr>
                        <td>${product.code}</td>
                          <td>${product.name}</td>
                          <td>${product.category}</td>
                          <td>${product.quantite}</td>
                          <td>${product.prixVenteHT}</td>
                          <td> ${(
                            product.quantite * product.prixVenteHT
                          ).toFixed(3)}</td>
                        
                        </tr>
                      `
                  )
                  .join("")
              )
              .join("")}
            </table>    
          <div class="total">
            <h3 style="margin-right: 10px;">TOTAL :  ${totalMontantSansTVA.toFixed(
              3
            )} TND</h3>
          </div>
        </div>
        <div class="invoice-footer">
          <div class="footer-left">
            <div>
              <h3>Base de calcule de la TVA pour les frais (TND)</h3>
              <table>
                <tr>
                  <th>BASE TVA</th>
                  <th>TAUX TVA</th>
                  <th>Remise</th>
                </tr>
                <tr>
                  <td style="text-align: center">19 %</td>
                  <td> ${tauxTva.toFixed(3)} TND</td>
                   ${
                     content[0].giveRemise
                       ? `<td>${content[0].Remise}%</td>`
                       : `<td>0%</td>`
                   }
                </tr>
              </table>
            </div>
            
          </div>
          <div class="footer-right">
            <div class="payment">
              <div>
                <h3>Montant Principal</h3>
                <h3>Timbre Fiscal</h3>
                <h3>Montant général</h3>
              </div>
              <div>
                <h3>${totalMontantSansTVA.toFixed(3)} TND</h3>
                ${
                  content[0].timbreFiscal
                    ? "<h3>1.000 TND</h3>"
                    : "<h3>0.000 TND</h3>"
                }
                <h3>${totalMontantAvecTVAetRemise.toFixed(3)} TND</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    
      
      </div>
      <style>
      .container {
        margin-top: 100px;
        height: 100%;
      }
      .text-footer {
        width: 80%;
        margin: 0 auto;
        text-align: center;
        margin-top: 50vh;
        font-size: 10px;
      }
      .left-down {
        height: 18vh;
      }
      .footer-right {
        height: 16.05vh;
      }
      .total {
        width: 100%;
        display: grid;
        justify-items: end;
      }
      .head {
        width: 95%;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 2em;
      }
      .payment {
        width: 100%;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
      .payment div {
        min-height: 181px;
        border: 1px solid black;
        padding-left: 10px;
      }

      .box {
        height: 165px;
        border: 2px solid black;
        display: grid;
        grid-template-rows: 2fr 6fr 1fr;
      }
      .box div {
        border: 1px solid black;
      }
      .box h3 {
        margin: 0;
        margin-left: 5px;
      }
      .box p {
        margin: 0;
        margin-left: 5px;
      }

      .invoice-body {
        width: 95%;
        min-height: 220px;
        margin: 0 auto;
        margin-top: 10px;
        border: 2px solid black;
        display: grid;
        grid-template-rows: auto 1fr auto;
      }

      .invoice-body div {
        border: 1px solid black;
      }

      .invoice-body th,
      .invoice-body td {
        padding: 10px;
      }

      .invoice-footer {
        width: 95%;
        height: 50px;
        margin: 0 auto;
        margin-top: 10px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 1em;
      }

      .invoice-footer .footer-right {
        border: 2px solid black;
      }

      .invoice-footer .footer-left {
        display: grid;
        grid-template-rows: 1fr 2fr;
        grid-gap: 1em;
      }

      .invoice-footer .footer-left div {
        border: 2px solid black;
      }
      table,
      td,
      th {
        border: 1px solid black;
        text-align: left;
      }

      table {
        border-collapse: collapse;
        width: 100%;
      }

      th,
      td {
        padding: 15px;
      }
    </style>      `,
  };
  html_to_pdf.generatePdf(f, options).then((pdfBuffer) => {
    var file = Readable.from(pdfBuffer);
    console.log("PDF Buffer:-", pdfBuffer);
    res.setHeader("Content-Length", Buffer.byteLength(pdfBuffer));
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=quote.pdf");
    file.pipe(res);
  });
};

module.exports = {
  generatePDF,
  generatePDFDevis,
  generatePDFBon,
};
