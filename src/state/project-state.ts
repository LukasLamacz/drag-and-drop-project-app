import { Project, ProjectStatus } from "../models/project.js";

// Project state management

//typ listener nema nadefinovany return type, tudiz void
type Listener = (items: Project[]) => void;

export class ProjectState {
    private listeners: Listener[] = [];
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {}
    //touhle funkci si vytvarim nove instance classy
    //zamezim situaci, ze bych mel vytvorenych vicero instanci ProjectState classy
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addListener(listenerFn: Listener) {
        this.listeners.push(listenerFn);
    }

    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus.Active
        );

        this.projects.push(newProject);
        this.updateListeners();
    }

    moveProject(projectId: string, newStatus: ProjectStatus) {
        const project = this.projects.find((prj) => prj.id === projectId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListeners();
        }
    }

    private updateListeners() {
        //kazda listener funkce se provede s argumentem projects array
        //takhle vzdy, kdyz vytvorim novy Project, nebo provedu zmenu jeho stavu, tak tu updatovanou array projektu provolam do vsechn vytvorenych listeneru
        for (const listenerFn of this.listeners) {
            //tim slice posilam do fce kopii projects array
            listenerFn(this.projects.slice());
        }
    }
}

export const projectState = ProjectState.getInstance();
