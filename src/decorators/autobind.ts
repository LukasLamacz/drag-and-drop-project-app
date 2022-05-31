// Autobind decorator
export function Autobind(
    _target: any,
    _methodName: string,
    descriptor: PropertyDescriptor
) {
    //timhle dostanu pristup na tu metodu, ktere davam decorator
    const originalMethod = descriptor.value;

    // Vytvorim novy object typu PropertyDescriptor, kteremu naconfiguruju get metodu
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            //ten this odkaze na cokoliv, co spustilo tuhle getter metodu
            //metoda je spustena v ramci objectu vytvoreneho z classy a this tedy bude odkazovat na ten object
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    //timhle vratim metode, ktera pouzije tenhle decorator, novou configuraci getteru
    return adjDescriptor;
}
