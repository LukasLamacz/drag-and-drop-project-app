// Component Base Class
//udelam z toho generic classu s tim, ze konkretni typ html elementu si nastavi classa to podedi
//tim abstract zamezim, ze by sla tahle classa instantiovat. Ma se z ni pouze dedit
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U; //tady mam ulozeny ten formular v pripade projectInput classy

    constructor(
        templateId: string,
        hostElementId: string,
        insertAtStart: boolean,
        newElementId?: string
    ) {
        //selectuju si formular a misto, kam vyrenderuju projekt
        this.templateElement = document.getElementById(
            templateId
        )! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostElementId)! as T;

        //importuju veskery html obsah toho vytvoreneho templateElement
        const importedNode = document.importNode(
            this.templateElement.content,
            true
        );
        this.element = importedNode.firstElementChild as U; //prvni html element toho templatu je form v pripade ProjectInput
        this.element.id = "user-input"; //priradim mu Id, abych ho mohl nastylovat

        //pokud mam i nove id, tak tohle priradim tomu elementu
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(insertAtStart);
    }

    private attach(insertAtBegining: boolean) {
        this.hostElement.insertAdjacentElement(
            insertAtBegining ? "afterbegin" : "beforeend",
            this.element
        ); //timhle si ten form vlozim do host elementu
    }

    //tim abstract donutim classy, kterou to bude dedit, aby tyhle metody implementovaly
    abstract configure(): void;
    abstract renderContent(): void;
}
