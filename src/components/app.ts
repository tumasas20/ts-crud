import Table from './table';
import cars from '../data/cars';
import brands from '../data/brands';
import models from '../data/models';
import CarsCollection, { CarProps } from '../helpers/cars-collection';
import stringifyProps, { type StringifyObjProps } from '../helpers/stringify-obj';
import CarJoined from '../types/car-joined';
import SelectField from './select-field';
import CarForm, { Values } from './car-form';

class App {
  private carsCollection: CarsCollection;

  private selectBrandId: null | string;

  private select: SelectField;

  private carTable: Table<StringifyObjProps<CarJoined>>;

  private carForm: CarForm;

  private htmlElement: HTMLElement;

  public constructor(selector: string) {
    const foundElement = document.querySelector<HTMLElement>(selector);

    if (foundElement === null) throw new Error(`Nerastas elementas su selektoriumi '${selector}'`);

    this.selectBrandId = null;

    this.htmlElement = foundElement;

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
      onDelete: this.handleCarDelete,
    });

    this.select = new SelectField({
      labelText: 'Markė',
      options: [
        { title: 'Visi automobiliai', value: '-1' },
       ...brands.map(({ id, title }) => ({ title, value: id })),
      ],
      onChange: this.handleBrandChange,
    });

    const initialBrandId = brands[0].id;
    this.carForm = new CarForm({
      title: 'Pridėti automobilį',
      submitBtnText: 'Pridėti',
      values: {
        brand: initialBrandId,
        model: models.filter((m) => m.brandId === initialBrandId)[0].id,
        price: '0',
        year: '2000',
      },
      onSubmit: this.handleCreateCar,
    });
  }

  handleBrandChange = (brandId: string): void => {
    const brand = brands.find((b) => b.id === brandId);
    this.selectBrandId = brand ? brandId : null;

    this.renderView();
  };

  private handleCarDelete = (carId: string): void => {
    this.carsCollection.deleteCarById(carId);

    this.renderView();
  };

  private handleCreateCar = ({
    brand, model, price, year,
  }: Values): void => {
    const carProps: CarProps = {
      brandId: brand,
      modelId: model,
      price: Number(price),
      year: Number(year),
    };

    this.carsCollection.add(carProps);

    this.renderView();
  };

  private renderView = (): void => {
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

  public initialize = (): void => {
    const uxContainer = document.createElement('div');
    uxContainer.className = 'd-flex gap-4 align-items-start';
    uxContainer.append(
      this.carTable.htmlElement,
      this.carForm.htmlElement,
    );

    const container = document.createElement('div');
    container.className = 'container d-flex flex-column my-4 gap-3';
    container.append(
      this.select.htmlSelectElement,
      uxContainer,
      );

    this.htmlElement.append(container);
  };
}

export default App;
