import countObjProperties from '../helpers/count-object-properties';

type RowsData = {
    id: string,
    [key: string]: string,
};

export type TableProps<Type> = {
    title: string,
    columns: Type,
    rowsData: Type[],
};

class Table<Type extends RowsData> {
    private props: TableProps<Type>;

    private tbody: HTMLTableSectionElement;

    private thead: HTMLTableSectionElement;

    public htmlElement: HTMLTableElement;

    public constructor(props: TableProps<Type>) {
        this.props = props;
        this.checkColumsCompatability();

        this.htmlElement = document.createElement('table');
        this.thead = document.createElement('tbody');
        this.tbody = document.createElement('tbody');

        this.initialize();
    }

    private checkColumsCompatability = (): void => {
        const { rowsData, columns } = this.props;

        if (this.props.rowsData.length === 0) return;
        const columnCount = countObjProperties(columns);

        const columnsCompatableWithRowsData = rowsData.every((row) => {
            const rowCellsCount = countObjProperties(row);

            return rowCellsCount === columnCount;
        });

        if (!columnsCompatableWithRowsData) {
            throw new Error('Nesutampa lentelės stulpelių skaičius su eilucių stulpelių skaičiumi');
        }
    };

    private initializeHead = (): void => {
        const { title, columns } = this.props;

        const headersArray = Object.values(columns);
        const headersRowHtmlString = headersArray.map((header) => `<th>${header}</th>`).join('');

        this.thead.className = 'bg-primary';
        this.thead.innerHTML = `
        <tr>
            <th colspan="${headersArray.length}"
            class="text-center h3">${title}</th>
        <tr>
        <tr>${headersRowHtmlString}</tr>
        `;
    };

    private initializeBody = (): void => {
        const { rowsData, columns } = this.props;

        this.tbody.className = 'bg-info text-white';
        this.tbody.innerHTML = '';
        const rowsHtmlElement = rowsData
            .map((rowData) => {
                const rowHtmlElement = document.createElement('tr');

                const cellsHtmlString = Object.keys(columns)
                    .map((key) => `<td>${rowData[key]}</td>`)
                    .join(' ');

                rowHtmlElement.innerHTML = cellsHtmlString;

                return rowHtmlElement;
            });

        this.tbody.append(...rowsHtmlElement);
    };

    private initialize = (): void => {
        this.initializeHead();
        this.initializeBody();

        this.htmlElement.className = 'table table-striped border p-3';
        this.htmlElement.append(
            this.thead,
            this.tbody,
        );
    };
}

export default Table;
