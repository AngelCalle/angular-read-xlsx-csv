import { Component } from '@angular/core';
import { ValidateFileService } from './validate-file.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

	xlsxValues!: any[];
	csvValues!: any[];

	constructor(
		protected readonly _validateFileService: ValidateFileService
	) { }

	uploadFile(): void {
		let input: HTMLInputElement = document.createElement('input');
		input.id = 'uploadFile';
		input.name = 'uploadFile';
		input.type = 'file';
		input.accept = '.xlsx, .csv';
		input.click();
		input.onchange = (event: any): void => {
			this.fileChange(event);
		}
	}

	fileChange(event: any): void {
		const FILE: HTMLInputElement = event.path[0] as HTMLInputElement;
		const EXTENSION: string | undefined = this._validateFileService.getFileExtension(FILE.value);
		if (EXTENSION === 'xlsx') {
			this.xlsx(FILE);
		} else if (EXTENSION === 'csv') {
			this.csv(event);
		}
	}

	xlsx(file: HTMLInputElement): void {
		this._validateFileService.uploadProcessXlsx(file);
		this._validateFileService.dataXlsx$.subscribe((dataXlsx: any[]): void => {
			if (dataXlsx && dataXlsx.length > 0) {
				this.xlsxValues = dataXlsx;
				console.log('📢 dataXlsx', this.xlsxValues);
			}
		});
	}

	csv(event: any): void {
		const URL_FILE: string = URL.createObjectURL((event.target.files[0]));
		this._validateFileService.uploadProcessCSV(URL_FILE);
		this._validateFileService.dataCsv$.subscribe((dataCsv: any[]): void => {
			if (dataCsv && dataCsv.length > 0) {
				this.csvValues = dataCsv;
				console.log('📢 dataCsv', this.csvValues);
			}
		});
	}

}
