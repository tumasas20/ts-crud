export type StringifyObjProps<Type extends Object> = {
    [Key in keyof Type]: string
};

const stringifyProps = <Type extends Object>(object: Type):
    StringifyObjProps<Type> => {
    const objectLikeArray = Object.entries(object);

    const objectWithPropsStringified = objectLikeArray
        .reduce<Partial<StringifyObjProps<Type>>>((prevObj, [key, value]) => ({
            ...prevObj,
            [key]: String(value),
        }), {});

    return objectWithPropsStringified as StringifyObjProps<Type>;
};

export default stringifyProps;
