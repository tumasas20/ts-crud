import Table from './table';
import cars from '../data/cars';
import brands from '../data/brands';
import models from '../data/models';
import CarsCollection from '../helpers/cars-collection';
import stringifyProps, { type StringifyObjProps } from '../helpers/stringify-obj';
import SelectField, { type Option } from './select-field';
import type Brand from '../types/brand';
import CarJoined from '../types/car-joined';

const brandToOption = ({ id, title }: Brand): Option => ({
  value: id,
  title,
});

class App {
  private htmlElement: HTMLElement;

  private carsCollection: CarsCollection;

  private selectBrandId: null | string;

  private select: SelectField;

  private carTable: Table<StringifyObjProps<CarJoined>>;

  public constructor(selector: string) {
    const foundElement = document.querySelector<HTMLElement>(selector);

    if (foundElement === null) throw new Error(`Nerastas elementas su selektoriumi '${selector}'`);

    this.carsCollection = new CarsCollection({ cars, brands, models });
    this.carTable = new Table({
      title: 'Visi automobiliai',
      columns: {
        id: 'Id',
        brand: 'Markė',
        model: 'Modelis',
        price: 'Kaina',
        year: 'Metai',
      },
      rowsData: this.carsCollection.all.map(stringifyProps),
    });

    this.select = new SelectField({
      option: brands.map(brandToOption),
      onChange: this.handleBrandChange,
    });
    this.selectBrandId = null;

    this.htmlElement = foundElement;

    this.initialize();
  }

  handleBrandChange = (brandId: string): void => {
    this.selectBrandId = brandId;

    this.update();
  };

  private update = (): void => {
    const { selectBrandId, carsCollection } = this;

    if (selectBrandId === null) {
      this.carTable.updateProps({
        title: 'Visi automobiliai',
        rowsData: carsCollection.all.map(stringifyProps),
      });
    } else {
      const brand = brands.find((b) => b.id === selectBrandId);
      if (brand === undefined) throw new Error('Tokios markės nėra');

      this.carTable.updateProps({
        title: `${brand.title} markės automobiliai`,
        rowsData: carsCollection.getBrandById(selectBrandId)
        .map(stringifyProps),
      });
    }
  };

  initialize = (): void => {
    const container = document.createElement('div');
    container.className = 'container d-flex flex-column my-4 gap-3';
    container.append(
      this.select.htmlSelectElement,
      this.carTable.htmlElement,
      );

    this.htmlElement.append(container);
  };
}

export default App;
