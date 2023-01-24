import Car from "./car";
import Model from "./model";
import Brand from "./brand";

type CarJoined = Omit<Car, 'modelId'> &{
    brand: Brand['title'],
    model: Model['title'],
};

export default CarJoined;
