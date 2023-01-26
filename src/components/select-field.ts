export type Option = {
    title: string,
    value: string,
};

type SelectFieldProps = {
    onChange: (value: string) => void,
    option: Option[],
};

class SelectField {
    public htmlSelectElement: HTMLSelectElement;

    private props: SelectFieldProps;

    constructor(props: SelectFieldProps) {
        this.htmlSelectElement = document.createElement('select');
        this.props = props;
        this.initialize();
    }

    initialize = () => {
        this.htmlSelectElement.className = 'form-select';
        this.htmlSelectElement.innerHTML = this.props.option
        .map(({ value, title }) => `<option value="${value}">${title}</option>`).join('');
        this.htmlSelectElement.addEventListener(
            'change',
            () => this.props.onChange(this.htmlSelectElement.value),
            );
    };
}

export default SelectField;
