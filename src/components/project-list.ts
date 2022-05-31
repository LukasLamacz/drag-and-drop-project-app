import { Component } from "./base-component.js";
import { DragTarget } from "../models/drag-drop.js";
import { Project, ProjectStatus } from "../models/project.js";
import { Autobind } from "../decorators/autobind.js";
import { ProjectItem } from "./project-item.js";
import { projectState } from "../state/project-state.js";

// ProjectList class
export class ProjectList
    extends Component<HTMLDivElement, HTMLElement>
    implements DragTarget
{
    type: "active" | "finished";
    assginedProjects: Project[];

    constructor(type: "active" | "finished") {
        super("project-list", "app", false, `${type}-projects`);
        this.assginedProjects = [];
        this.type = type;

        this.configure();
        this.renderContent();
    }

    private renderProjects() {
        //vytvorim si ul element
        const listEl = document.getElementById(
            `${this.type}-projects-list`
        )! as HTMLUListElement;
        listEl.innerHTML = ""; //timhle si to vyprazdnim, abych tam nepridaval projekty duplikovane
        for (const prjItem of this.assginedProjects) {
            new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
        }
    }

    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("ul")!.id = listId; //prvnimu ul priradim id
        this.element.querySelector(
            "h2"
        )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
    }

    configure() {
        this.element.addEventListener("dragover", this.dragOverHandler);
        this.element.addEventListener("dragleave", this.dragLeaveHandler);
        this.element.addEventListener("drop", this.dropHandler);
        //vlozim listener funkci do globalniho projectState
        //ta funkce mi vezme array projektu z globalniho statu a ulozi si ji do property assginedProjects
        //zavolam pak render
        projectState.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter((prj) => {
                if (this.type === "active") {
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
            });
            this.assginedProjects = relevantProjects;
            this.renderProjects();
        });
    }

    @Autobind
    dragOverHandler(event: DragEvent) {
        //tohle je check abych mohl dragovat pouze veci typu text/plain
        if (
            event.dataTransfer &&
            event.dataTransfer.types[0] === "text/plain"
        ) {
            //Prevent default na drag over elementu musi byt vzdy, kdyz potrebuju mit funkcni drop na stejnem elementu
            //jinak by nefungoval drop event
            event.preventDefault();
            const listEl = this.element.querySelector("ul")!;
            listEl.classList.add("droppable");
        }
    }

    @Autobind
    dropHandler(event: DragEvent) {
        const projectId = event.dataTransfer!.getData("text/plain");
        //Project list object ma propertu type, podle ktere urcim status toho ul listu a ten priradim tomu projektu, ktery tam dropnu
        projectState.moveProject(
            projectId,
            this.type == "active"
                ? ProjectStatus.Active
                : ProjectStatus.Finished
        );
    }

    @Autobind
    dragLeaveHandler(_event: DragEvent) {
        const listEl = this.element.querySelector("ul")!;
        listEl.classList.remove("droppable");
    }
}
