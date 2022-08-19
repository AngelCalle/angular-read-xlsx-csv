import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WorkBook, WorkSheet } from 'xlsx/types';

@Injectable({
	providedIn: 'root'
})
export class ValidateFileService {

	#dataXlsxBehaviorSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
	dataXlsx$ = this.#dataXlsxBehaviorSubject.asObservable();

	#dataCsvBehaviorSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
	dataCsv$ = this.#dataCsvBehaviorSubject.asObservable();

	constructor(
		protected readonly _httpClient: HttpClient
	) { }

	getFileExtension(fileName: string): string | undefined {
		return (/[.]/.exec(fileName)) ? Object.getOwnPropertyDescriptors(/[^.]+$/.exec(fileName))[0].value : undefined;
	}

	uploadProcessXlsx(file: HTMLInputElement): void {
		import('xlsx').then((xlsx): void => {
			let reader: FileReader = new FileReader();
			reader.onload = (): void => {
				const DATA: string | ArrayBuffer | null = reader.result;
				const WORKBOOK: WorkBook = xlsx.read(DATA, { type: 'binary' });
				const WORKSHEET: string = WORKBOOK.SheetNames[0];
				const SHEET: WorkSheet = WORKBOOK.Sheets[WORKSHEET];
				const JSON_DATA: unknown = xlsx.utils.sheet_to_json(SHEET);
				this.formatDataFileXlsx(JSON_DATA);
			};
			if (file.files) {
				reader.readAsBinaryString(file.files[0]);
			}
		});
	}

	formatDataFileXlsx(data: any): void {
		let items: any[] = [];

		const SELECT_INDEX_COLUMN_ONE: string = 'key';
		const SELECT_INDEX_COLUMN_TWO: string = 'value';
		const PROPERTY_NAME_ONE: string = 'key';
		const PROPERTY_NAME_TWO: string = 'value';

		for (const key in data) {
			if (Object.prototype.hasOwnProperty.call(data, key)) {
				const ITEM: any = {
					[PROPERTY_NAME_ONE]: data[key][SELECT_INDEX_COLUMN_ONE],
					[PROPERTY_NAME_TWO]: data[key][SELECT_INDEX_COLUMN_TWO],
				}
				if (ITEM[PROPERTY_NAME_ONE] && ITEM[PROPERTY_NAME_TWO]) {
					items.push(ITEM);
				}
			}
		}
		this.#dataXlsxBehaviorSubject.next(items);
	}

	uploadProcessCSV(url: string): void {
		this._httpClient.get(url, { responseType: 'text' })
			.subscribe((fileBody: string): void => {
				this.formatDataFileCsv(fileBody);
			})
	}

	formatDataFileCsv(fileBody: string): void {
		const SELECT_INDEX_COLUMN_ONE: number = 0;
		const SELECT_INDEX_COLUMN_TWO: number = 1;
		const PROPERTY_NAME_ONE: string = 'key';
		const PROPERTY_NAME_TWO: string = 'value';
		const ROW_SEPARATOR: string = '\n';
		const COLUMN_SEPARATOR: string = ';';
		const BODY: string[] = fileBody.split(ROW_SEPARATOR);

		let items: any[] = [];
		BODY.forEach((data: string, index: number): void => {
			if (index !== 0) {
				const ITEM: any = {
					[PROPERTY_NAME_ONE]:
						data.split(COLUMN_SEPARATOR)[SELECT_INDEX_COLUMN_ONE] !== ('' && undefined) ? data.split(COLUMN_SEPARATOR)[SELECT_INDEX_COLUMN_ONE] : undefined,
					[PROPERTY_NAME_TWO]:
						data.split(COLUMN_SEPARATOR)[SELECT_INDEX_COLUMN_TWO] !== ('' && undefined) ? data.split(COLUMN_SEPARATOR)[SELECT_INDEX_COLUMN_TWO]?.slice(2, data.split(COLUMN_SEPARATOR)[1].length) : undefined
				}
				if (ITEM[PROPERTY_NAME_ONE] && ITEM[PROPERTY_NAME_TWO]) {
					items.push(ITEM);
				}
			}
		});
		this.#dataCsvBehaviorSubject.next(items);
	}

}
