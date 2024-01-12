import { DatePipe } from "@angular/common";

import { DomSanitizer } from '@angular/platform-browser';

import swal from "sweetalert2";
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  FilesResponse,
  UploadFile,
  UploadFileModel,
} from "app/services/archivo.model";
import { ArchivoService } from "app/services/archivo.service";
import { AuthService } from "app/services/auth.service";
import { ICuenta } from "app/services/cuentas.model";
import { CuentasService } from "app/services/cuentas.service";
import { IFile } from "app/services/shared.model";
import * as e from "express";
import { NgxSpinnerService } from "ngx-spinner";
import { BehaviorSubject, finalize } from "rxjs";

@Component({
  selector: "app-upload-data",
  templateUrl: "./upload-data.component.html",
  styleUrls: ["./upload-data.component.css"],
  providers: [DatePipe],
})
export class UpLoadDataComponent implements OnInit {
  @Input() type: string;
  @ViewChild("fileInput") fileInput: ElementRef;
  cuenta: string;
  usuario: string;
  cuentaSeleccionada: string;
  endDate = new FormControl();
  startDate = new FormControl();
  startDate1 = new FormControl();
  account = new FormControl();
  fileName = "";
  title = new FormControl("");
  cuentas: Array<ICuenta> = [];
  lastUploads: FilesResponse = [];
  uploadFile: UploadFile;
  optionsCuentas: Array<{ value: string; viewValue: string }> = [];
  loadingLast$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  chargePercentage = 0;

  public chosenDate: Date;
  ultimodia: any; // = new Date();

  @HostListener("window:UPLOAD-FILE-REPORT", ["$event"])
  loadFilePercent(event: CustomEvent) {
    console.log("window:UPLOAD-FILE-REPORT", event);
    this.chargePercentage = event.detail;
  }


  grabarsemanal : boolean = false;

  constructor(
    private authService: AuthService,
    private archivoService: ArchivoService,
    private cuentasService: CuentasService,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe
  ) {
    const toDay = new Date();
    const month = toDay.getMonth();
    this.startDate.setValue(new Date(toDay.getFullYear(), month - 1, 1));
    this.endDate.setValue(new Date(toDay.getFullYear(), month, 0));
    this.setTitle();

    if(localStorage.getItem("grabar") == "S"){

      this.grabarsemanal =true;
    }else{
      
      this.grabarsemanal =false;
    }

  }
  get dateUTC() {
    if (this.chosenDate) {
      return new Date(
        this.chosenDate.getUTCFullYear(),
        this.chosenDate.getUTCMonth(),
        this.chosenDate.getUTCDate(),
        this.chosenDate.getUTCHours(),
        this.chosenDate.getUTCMinutes(),
        this.chosenDate.getUTCSeconds()
      );
    }
  }

  disableWeekend(d: Date) {
    debugger;
    var grabar = `${localStorage.getItem("grabar")}`;
    var type = `${localStorage.getItem("type")}`;
    const str = `${localStorage.getItem("ultimoDia")}`;
    const date = new Date(str);

    // if (grabar == "S" && type.toUpperCase() == "INVENTARIO") {
    //   if (
    //     d.getDay() != 0 &&
    //     d.getDay() != 2 &&
    //     d.getDay() != 3 &&
    //     d.getDay() != 4 &&
    //     d.getDay() != 5 &&
    //     d.getDay() != 6
    //   ) {
    //     return d;
    //   }
    // } else if (grabar == "M" && type.toUpperCase() == "INVENTARIO") {
    //   var lastDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    //   var dvar = d.toLocaleDateString();
    //   var lastvar = lastDayOfMonth.toLocaleDateString();
    //   //console.log("DIA : "+dvar+" ULTIMO DIA: "+lastvar);
    //   var today = new Date();
    //   var yesterday = new Date();
    //   yesterday.setDate(today.getDate() - 0);
    //   if (dvar.toString() == lastvar.toString()) {
    //     return d;
    //   }
    // } else {
    //   return d;
    // }



    return d;
  }

  onlyMonday() {
    var grabar = `${localStorage.getItem("grabar")}`;
    console.log("TIPO--: " + grabar + " TIPO : " + this.type);
    if (grabar == "M" && this.type == "IN") {
      this.ultimodia = new Date();
      var today = new Date();
      var lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      );
      this.ultimodia.setDate(lastDayOfMonth.getDate());
      localStorage.setItem("ultimoDia", this.ultimodia);
    }
  }

  ngOnInit() {
    this.cuenta = this.authService.getCuenta();
    this.usuario = this.authService.getUsuario();
    var grabar = `${localStorage.getItem("grabar")}`;

    //let div = document.getElementById('cbohasta');
    let div = document.getElementById("cbohasta");
    if (div != null) {
      if (grabar == "S") {
        div.style.display = "none";

        let label = document.getElementById("cbolabel");
        label.innerHTML = "<h4>Fecha de cierre de inventario semanal</h4>";
      }
      if (grabar == "M") {
        div.style.display = "none";

        let label = document.getElementById("cbolabel");
        label.innerHTML = "<h4>Fecha de cierre de inventario mensual</h4>";
      }
    }

    this.getListCuentas();
  }

  descargar(value) {
    window.open(value, "_blank");
  }


  descargarPlantilla(type) {
    switch (type) {
      case "VE":
        window.open('/assets/plantillas/Plantilla_Ventas.xlsx', "_blank");
        break;
      case "IN":
        window.open('/assets/plantillas/Plantilla_Inventario.xlsx', "_blank");
        break;
      case "FA":
        window.open('/assets/plantillas/Plantilla_Facturacion.xlsx', "_blank");
        break;
      case "TR":
        window.open('/assets/plantillas/Plantilla_Trafico.xlsx', "_blank");
        break;
      default:
        break;
    }
  }


  getListCuentas(): void {
    const setCuentas = (response: any) => (this.cuentas = response);
    const setValues = () => {
      this.account.setValue(this.cuentas[0]?.cliente);
      this.onSelectedAccount();
      this.optionsCuentas = this.cuentas.map((c) => ({
        value: c.cliente,
        viewValue: c.cliente,
      }));
    };

    if (this.authService.isCuenta()) {
      this.cuentasService
        .getCuentas(this.cuenta)
        .pipe(finalize(setValues))
        .subscribe(setCuentas);
    } else {
      this.cuentasService
        .getAllCuentas()
        .pipe(finalize(setValues))
        .subscribe(setCuentas);
    }
  }

  getLastUpload(): void {
    this.lastUploads = [];
    this.loadingLast$.next(true);
    this.archivoService
      .Search({ tipo: this.type, cuenta: this.cuentaSeleccionada, limit: 3 })
      .subscribe({
        next: (response) => (this.lastUploads = response),
        complete: () => this.loadingLast$.next(false),
      });
  }

  onFileSelected(): void {
    const fileInput: HTMLInputElement = this.fileInput.nativeElement;
    this.fileName = fileInput?.files[0]?.name;
  }

  onChangeStartDate(): void {
    if (this.startDate.value) {
      const startDate = this.startDate.value as Date;
      var grabar = `${localStorage.getItem("grabar")}`;
      if (grabar == "M") {
        const mes = startDate.getMonth();
        const anno = startDate.getFullYear();
        var mesletras = "";
        const monthNames = [
          "enero ",
          "febrero ",
          "marzo ",
          "abril ",
          "mayo ",
          "junio ",
          "julio ",
          "agosto ",
          "setiembre ",
          "octubre ",
          "noviembre ",
          "diciembre ",
        ];
        let label = document.getElementById("cbolabel");
        label.innerHTML =
          "<h4> Fecha de cierre de inventario  " +
          monthNames[mes] +
          anno +
          "</h4>";
      }
      if (this.type === "IN") {

        var r = this.filterFirstMondayOfMonth(this.startDate.value);
        // alert(r);
        if(r){
          var d = this.getLastDayOfPreviousMonth(this.startDate.value);
          // alert(d);
          this.startDate.setValue(
            new Date(d) //startDate.getFullYear(), startDate.getMonth() + 1, 0)
          );
        }
        // else{
        //   this.endDate.setValue(
        //     new Date(startDate) //startDate.getFullYear(), startDate.getMonth() + 1, 0)
        //   );
        // }






      } else {
        this.endDate.setValue(
          new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
        );
      }
    }
    this.setTitle();
    this.clear();
  }

  onSelectedAccount(): void {
    this.cuentaSeleccionada = this.account.value;
    this.getLastUpload();
    this.setTitle();
    this.clear();
  }

  setTitle(): void {
    if (this.startDate.value) {
      const startDate = this.startDate.value as Date;
      const date = this.datePipe.transform(this.startDate.value, "dd_MM_yyyy");
      // const month = `0${startDate.getMonth() + 1}`.substring(-2);
      // const day = `0${startDate.getDay() + 1}`.substring(-2);
      this.title.setValue(`${this.type}_${this.account.value || ""}_${date}`);
    } else {
      this.title.setValue("");
    }
  }

  onUploadFile(): void {
    // console.log("this.type  ========>",this.type);

    swal
      .fire({
        width: 900,
        title: "Importante / Important",
        html: `Al finalizar la carga de ventas e inventario, confirmo la veracidad de los datos y acepto el uso de los mismos para reportes y análisis. Northbay International Inc. se hace responsable del buen uso, manejo, almacenamiento y confidencialidad de la información sumistrada.
      Existirá un periodo de rectificación de 2 días, en el que, de ser necesario, se podrá dar de baja la información cargada para la actualización en ese periodo.      
      Para cualquier información/consulta, contactar a su Analista de Datos  asignado en Northbay International Inc.
       <b><h1>------------------------------------------------</h1></b>    
      By uploading this sales and inventory info., I confirm the veracity of the data and accept their use for reports and analysis. Northbay International Inc. is responsible for the proper use, management, storage and confidentiality of the  provided information.      
      There will be a rectification period of 2 days, where the data could be deleted and reuploaded if necessary.
      For any information/concern, contact your assigned Data Analyst in Northbay International Inc.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Cargar / Yes Upload",
      })
      .then((result) => {
        if (result.value) {
          this.chargePercentage = 0;
          this.uploadFile = null;
          const fileInput: HTMLInputElement = this.fileInput.nativeElement;
          if (!fileInput.files) {
            return;
          }

          const file: IFile = {
            name: "file",
            data: fileInput.files[0],
            inProgress: false,
            progress: 0,
          };

          if (this.type == "IN") {
            var currentDate = new Date(this.startDate.value);
            const lastDayOfMonth = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth() + 1,
              0
            );
            const lastDayOfMonthFormatted = this.datePipe.transform(
              lastDayOfMonth,
              "yyyy-MM-dd"
            );
            ////
            var model: UploadFileModel = {
              cuenta: this.account.value,
              fechaInicial: this.datePipe.transform(
                this.startDate.value,
                "yyyy-MM-dd"
              ),
              fechaFinal: lastDayOfMonthFormatted,
            };
          } else {
            var model: UploadFileModel = {
              cuenta: this.account.value,
              fechaInicial: this.datePipe.transform(
                this.startDate.value,
                "yyyy-MM-dd"
              ),
              fechaFinal: this.datePipe.transform(
                this.endDate.value,
                "yyyy-MM-dd"
              ),
            };
          }

          file.inProgress = true;
          this.spinner.show();
          this.archivoService
            .UploadFile(this.type, file, model)
            .pipe(finalize(() => this.spinner.hide()))
            .subscribe((response) => {
              console.log("LACL =>", response);
              if (response.status === 200) {
                this.uploadFile = response.json;
                if (response.json.errores.length > 0) {
                  this.snackBar.open(
                    "No pueden enviar sus datos,  descargue la lista de Errores e intente nuevamente.",
                    "x",
                    { duration: 15000, panelClass: ["warning-snackbar"] }
                  );
                } else {
                  this.snackBar.open(
                    "No se encontraron errores, los datos fueron enviados.",
                    "x",
                    { duration: 15000, panelClass: ["success-snackbar"] }
                  );
                }
              } else {
                if (response.status === 400) {
                  this.snackBar.open(response.message, "x", {
                    duration: 15000,
                    panelClass: ["error-snackbar"],
                  });
                } else {
                  this.snackBar.open(
                    "Ocurrio un error al cargar el archivo, si el error persiste comuniquese con su administrador.",
                    "x",
                    { duration: 15000, panelClass: ["error-snackbar"] }
                  );
                }
              }
            });
        }
      });
  }

  downloadErrors() {
    let tbody = "";
    // console.log(JSON.stringify(this.uploadFile?.errores));

    var groupss1 = this.groupItems(this.uploadFile?.errores, "fila"); // array will be grouped
    var grroup = [];
    for (var key in groupss1) {
      var group = groupss1[key];
      grroup.push({
        key: key,
        groups: group,
      });
    }
    var htmlbody = "";
    grroup.forEach((ele) => {
      if (ele.groups.length > 1) {
        var htmltd = "";
        ele.groups.forEach((ele2) => {
          htmltd += `
            <td style="border: 1px solid black;border-collapse: collapse;"> ${ele2.fila}   </td>
            <td style="border: 1px solid black;border-collapse: collapse;"> ${ele2.errores}</td> `;
        });
        htmlbody += `<tr> ${htmltd}</tr>`;
      } else {
        htmlbody += ` 
          <tr>
          <td style="border: 1px solid black;border-collapse: collapse;"> ${ele.groups[0].fila}   </td>
          <td style="border: 1px solid black;border-collapse: collapse;"> ${ele.groups[0].errores}   </td> 
          </tr>`;
      }
    });
    // debugger;
    var arreglo = this.uploadFile?.errores;
    var strcadFinal = "";
    var strcad = "";
    var index = 0;
    var campo = "";
    //console.log(arreglo);
    console.log(this.uploadFile?.errores);
    this.uploadFile?.errores.forEach((item) => {
      console.log("clever");
      strcad = "<tr>";
      strcad =
        strcad +
        "<td  style='border: 1px solid black;border-collapse: collapse;'>" +
        item.fila +
        "</td>";
      strcad =
        strcad +
        "<td  colspan='6'style='border: 1px solid black;border-collapse: collapse;'>" +
        item.errores +
        "</td>";

      strcadFinal = strcadFinal + strcad + "</tr>";

      // this.uploadFile?.errores.forEach((item) => {
      //   item.errores.forEach((err) => {
      //     tbody += `
      //     <tr>
      //     <td style="border: 1px solid black;border-collapse: collapse;">
      //     ${item.fila}
      //     </td>
      //     <td style="border: 1px solid black;border-collapse: collapse;">
      //     ${err}
      //     </td>
      //     </tr>`;
      //   });
    });
    // strcadFinal=strcadFinal;
    tbody = strcadFinal;
    // console.log(tbody);
    // console.log(tbody);
    const filename = `${this.type}_errores_${this.datePipe.transform(
      new Date(),
      "yyyy-MM-dd"
    )}`;
    /*  console.log(JSON.stringify(grroup));
  console.log(htmlbody);
  console.log(tbody);*/
    this.exportTableToExcel(`${filename}.xls`, tbody);
  }
  groupItems(array, property) {
    return array.reduce(function (groups, item) {
      var name = item[property];
      var group = groups[name] || (groups[name] = []);
      group.push(item);
      return groups;
    }, {});
  }
  exportTableToExcel(filename: string, tBody: string) {
    const uri = "data:application/vnd.ms-excel;base64,";
    const template =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
    const base64 = (s) => {
      return window.btoa(unescape(encodeURIComponent(s)));
    };
    const format = (s, c) => {
      return s.replace(/{(\w+)}/g, function (m, p) {
        return c[p];
      });
    };

    let tHead = `<tr><td colspan="7">Errores de validación con SIGHA en la Carga Preliminar de ${this.getTipo(
      this.type
    )}</td></tr>`;
    tHead += `<tr><td colspan="7" style="border: 1px solid black;border-collapse: collapse;">Archivo: ${this.fileName}</td></tr>`;
    tHead += `<tr><td colspan="7" style="border: 1px solid black;border-collapse: collapse;">Usuario: ${this.usuario}</td></tr>`;
    tHead += `<tr><td colspan="7" style="border: 1px solid black;border-collapse: collapse;">Secuencia: ${this.uploadFile?.secuencia}</td></tr>`;
    tHead += `<tr><td colspan="7" style="border: 1px solid black;border-collapse: collapse;">Fecha de carga: ${this.datePipe.transform(
      new Date(),
      "dd/MM/yyyy"
    )}</td></tr>`;

    const ctx = {
      worksheet: "errores",
      table: `${tHead}<tr><td  style="border: 1px solid black;border-collapse: collapse;">Fila</td><td  colspan="6" style="border: 1px solid black;border-collapse: collapse;">Mensaje Error</td></tr>${tBody}`,
    };

    // Create download link element
    const downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    // Create a link to the file
    // downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    downloadLink.href = uri + base64(format(template, ctx));
    // Setting the file name
    downloadLink.download = filename;
    // triggering the function
    downloadLink.click();
  }

  clear(): void {
    this.uploadFile = null;
    this.fileInput.nativeElement.value = "";
    this.fileName = "";
  }
  getTipo(type: string): string {
    // this.onlyMonday();
    let value = "";
    switch (type) {
      case "VE":
        value = "Ventas";
        break;
      case "IN":
        value = "Inventario";
        break;
      case "FA":
        value = "Facturación";
        break;
      case "TR":
        value = "Tráfico";
        break;
      default:
        break;
    }

    return value;
  }

  getMessageUpload(): string {
    return `Cargando archivo... ${this.chargePercentage}%`;
  }

////////////////////////////////////////////////////////////////////


  filterMondays = (date: Date) => {
    if (!date) {
      return false; // o cualquier otro valor que corresponda a tu lógica
    }  
    const day = date.getDay();
    return day === 1; // Habilitar solo los lunes (día = 1)
  }


  filterLastDayOfMonth = (date: Date) => {
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); // Obtener el último día del mes
    return date.getDate() === lastDayOfMonth; // Habilitar solo el último día del mes
  }



//////////////////////////////////////

  filterFirstMondayOfMonth = (date: Date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstMondayOfMonth = this.getFirstMonday(firstDayOfMonth);
    return this.isSameDate(date, firstMondayOfMonth);
  }
  
  getFirstMonday(date: Date): Date {
    const day = date.getDay();
    const diff = (day <= 1) ? 1 - day : 8 - day;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + diff);
  }
  
  isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  //////////////

  // obtenerl el ultimo dia del mes anterior

  getLastDayOfPreviousMonth(date): Date {
    const currentDate = new Date(date);
    const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const lastDayOfPreviousMonth = new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0);
    return lastDayOfPreviousMonth;
  }


}
