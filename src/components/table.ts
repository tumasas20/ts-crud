import countObjProperties from '../helpers/count-object-properties';

type RowsData = {
    id: string,
    [key: string]: string,
};

export type TableProps<Type> = {
    title: string,
    columns: Type,
    rowsData: Type[],
    editedCarId: string | null,
    onDelete: (id: string) => void,
    onEdit: (id: string) => void,
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

    private initialize = (): void => {
        this.htmlElement.className = 'table table-striped border p-3';
        this.htmlElement.append(
            this.thead,
            this.tbody,
        );

        this.renderView();
    };

    private renderView = (): void => {
        this.renderHeadView();
        this.renderBodyView();
    };

    private renderHeadView = (): void => {
        const { title, columns } = this.props;

        const headersArray = Object.values(columns);
        const headersRowHtmlString = headersArray.map((header) => `<th>${header}</th>`).join('');

        this.thead.className = 'bg-primary';
        this.thead.innerHTML = `
        <tr>
            <th colspan="${headersArray.length}"
            class="text-center h3">${title}</th>
            <th></th>
        </tr>
        <tr>${headersRowHtmlString}<th></th></tr>`;
    };

    private renderBodyView = (): void => {
        const { rowsData, columns, editedCarId } = this.props;

        this.tbody.className = 'bg-info text-white';
        this.tbody.innerHTML = '';
        const rowsHtmlElement = rowsData
            .map((rowData) => {
                const tr = document.createElement('tr');
                if (editedCarId === rowData.id) {
                    tr.style.backgroundColor = '#e1e55b';
                }

                const cellsHtmlString = Object.keys(columns)
                    .map((key) => `<td>${rowData[key]}</td>`)
                    .join(' ');

                tr.innerHTML = cellsHtmlString;

                this.addActionsCell(tr, rowData.id);

                return tr;
            });

        this.tbody.append(...rowsHtmlElement);
    };

    private addActionsCell = (tr: HTMLTableRowElement, id: string): void => {
        const { onDelete, onEdit, editedCarId } = this.props;

        const buttonCell = document.createElement('td');
        buttonCell.className = 'd-flex justify-content-center gap-3';

        const isCancelButton = editedCarId === id;
        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.innerHTML = isCancelButton ? '🚫' : '🖉';
        editButton.className = `btn btn-${isCancelButton ? 'dark' : 'warning'}`;
        editButton.style.width = '50px';
        editButton.addEventListener('click', () => onEdit(id));

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.innerHTML = '❌';
        deleteButton.className = 'btn btn-danger';
        deleteButton.style.width = '50px';
        deleteButton.addEventListener('click', () => onDelete(id));

        buttonCell.append(editButton, deleteButton);
        tr.append(buttonCell);
    };

    public updateProps = (newProps: Partial<TableProps<Type>>): void => {
        this.props = {
            ...this.props,
            ...newProps,
        };

        this.renderView();
    };
}

export default Table;
