import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Drawflow, {
  ConnectionEvent,
  ConnectionStartEvent,
  DrawFlowEditorMode,
  DrawflowConnection,
  DrawflowConnectionDetail,
  DrawflowNode,
  MousePositionEvent,
} from 'drawflow';
import { NodeElement } from './node.model';

@Component({
  selector: 'app-draw-board',
  templateUrl: './draw-board.component.html',
  styleUrls: ['./draw-board.component.scss'],
})
export class DrawBoardComponent implements OnInit, AfterViewInit {
  nodes: NodeElement[] = [];
  nodesHTML!: NodeListOf<Element>;
  @ViewChild('txtArea', {static: true}) txtArea!: TemplateRef<any>;
  nodesDrawn: any[] = [];
  selectedItem!: NodeElement;
  editor!: any;

  locked: boolean = false;

  lastMousePositionEv: any;

  drawFlowHtmlElement!: HTMLElement;
  public selectedItemId: number = 0;
  public positionX: number = 0;
  public positionY: number = 0;
  public nodeSelection = [
    { id: 1, name: 'Single Output', inputs: 0, outputs: 1, },
    { id: 2, name: 'Single Input', inputs: 1, outputs: 0, },
    { id: 3, name: 'Single Input and Output', inputs: 1, outputs: 1, },
    { id: 4, name: 'Custom IO', inputs: 0, outputs: 0, },
  ]

  constructor(
    private element: ElementRef,
    private router: Router,
    private CFR: ComponentFactoryResolver
  ) {}

  public back(): void {
    this.router.navigateByUrl('');
  }

  public initializeList(length: number) {
    this.nodes = this.nodeSelection;
    // for (let i = 0; i < length; i++) {
    //   this.nodes.push({
    //     id: i + 1,
    //     name: 'Diagram' + (i + 1),
    //     inputs: 0,
    //     outputs: 0,
    //   });
    // }
  }

  private initDrawFlow(htmlElement: HTMLElement): void {
    this.editor = new Drawflow(htmlElement);
    this.editor.reroute = true;
    this.editor.reroute_fix_curvature = true;
    this.editor.force_first_input = false;
    this.editor.start();
    const dataToImport = {
      drawflow: {
        Home: {
          // data: {
          //   '1': {
          //     id: 1,
          //     name: 'node1',
          //     data: {},
          //     class: '',
          //     html: '\n          <div>\n           <input min="0" />\n          </div>\n          ',
          //     typenode: false,
          //     inputs: {},
          //     outputs: {},
          //     pos_x: 134,
          //     pos_y: 131,
          //   },
          //   '2': {
          //     id: 2,
          //     name: 'node2',
          //     data: {template: 'HAHAHAH'},
          //     class: 'template',
          //     html: '\n          <div>\n            <i class="title-box">node2</i>\n <textarea df-template></textarea>         </div>\n          ',
          //     typenode: false,
          //     inputs: {
          //       input_1: {
          //         connections: [
          //           {
          //             node: '3',
          //             input: 'output_1',
          //           },
          //         ],
          //       },
          //     },
          //     outputs: {
          //       output_1: {
          //         connections: [
          //           {
          //             node: '3',
          //             output: 'input_1',
          //           },
          //         ],
          //       },
          //     },
          //     pos_x: 520,
          //     pos_y: 111,
          //   },
          //   '3': {
          //     id: 3,
          //     name: 'node3',
          //     data: {},
          //     class: '',
          //     html: '\n          <div>\n            <i class="title-box">node3</i>\n          </div>\n          ',
          //     typenode: false,
          //     inputs: {
          //       input_1: {
          //         connections: [
          //           {
          //             node: '2',
          //             input: 'output_1',
          //           },
          //         ],
          //       },
          //     },
          //     outputs: {
          //       output_1: {
          //         connections: [
          //           {
          //             node: '2',
          //             output: 'input_1',
          //           },
          //         ],
          //       },
          //     },
          //     pos_x: 525,
          //     pos_y: 321,
          //   },
          // },
          data: {}
        },
      },
    };
    console.error('dataToImport',dataToImport)
    this.editor.import(dataToImport);
  }

  ngAfterViewInit(): void {
    this.drawFlowHtmlElement = <HTMLElement>document.getElementById('drawflow');
    this.initDrawFlow(this.drawFlowHtmlElement);

    // Events!
    this.editor.on('nodeCreated', (id: any) => {
      console.log(
        'Editor Event :>> Node created ' + id,
        this.editor.getNodeFromId(id)
      );
    });

    this.editor.on('nodeRemoved', (id: any) => {
      console.log('Editor Event :>> Node removed ' + id);
    });

    this.editor.on('nodeSelected', (id: any) => {
      // debugger
      console.log(
        'Editor Event :>> Node selected ' + id,
        this.editor.getNodeFromId(id)
      );
    });

    this.editor.on('moduleCreated', (name: any) => {
      console.log('Editor Event :>> Module Created ' + name);
    });

    this.editor.on('moduleChanged', (name: any) => {
      console.log('Editor Event :>> Module Changed ' + name);
    });

    this.editor.on('connectionCreated', (connection: any) => {
      console.log('Editor Event :>> Connection created ', connection);
    });

    this.editor.on('connectionRemoved', (connection: any) => {
      console.log('Editor Event :>> Connection removed ', connection);
    });

    // this.editor.on('mouseMove', (position: any) => {
    //   console.log('Editor Event :>> Position mouse x:' + position.x + ' y:' + position.y);
    // });

    this.editor.on('nodeMoved', (id: any) => {
      console.log('Editor Event :>> Node moved ' + id);
    });

    this.editor.on('zoom', (zoom: any) => {
      console.log('Editor Event :>> Zoom level ' + zoom);
    });

    // this.editor.on('translate', (position: any) => {
    //   console.log(
    //     'Editor Event :>> Translate x:' + position.x + ' y:' + position.y
    //   );
    // });

    this.editor.on('addReroute', (id: any) => {
      console.log('Editor Event :>> Reroute added ' + id);
    });

    this.editor.on('removeReroute', (id: any) => {
      console.log('Editor Event :>> Reroute removed ' + id);
    });
  }

  ngOnInit(): void {
    this.initializeList(5);
    this.initializeFormGroup();
  }

  public formGorup!: FormGroup;
  public initializeFormGroup(): void {
    this.formGorup = new FormGroup({
      test: new FormControl('test')
    })
    console.error('this.formGorup',this.formGorup)
  }

  // Drag Events
  onDragStart(e: any) {
    if (e.type === 'dragstart') {
      console.log('onDragStart :>> e :>> ', e);
      this.selectedItem = <NodeElement>(
        this.nodes.find((node: NodeElement) => node.name === e.target.outerText)
      );
    }
  }

  onDragEnter(e: any) {
    console.log('onDragEnter :>> e :>> ', e);
  }

  onDragLeave(e: any) {
    console.log('onDragLeave :>> e :>> ', e);
  }

  onDragOver(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.lastMousePositionEv = e;
    // console.log('onDragOver :>> e :>> ', e);
  }

  onDragEnd(e: any) {
    console.log('onDragend :>> e :>> ', e);
  }

  onDrop(e: any) {
    // After dropping the element, create a node
    if (e.type === 'drop') {
      console.log('onDrop :>> e :>> ', e);
      e.preventDefault();
      this.addNodeToDrawBoard(e.clientX, e.clientY);
      this.resetAllInputsOutputs();
    }
  }

  resetAllInputsOutputs() {
    // this.nodes.forEach((node) => {
    //   node.inputs = 0;
    //   node.outputs = 0;
    // });
  }

  // Drawflow Editor Operations
  addNodeToDrawBoard(pos_x: number, pos_y: number) {
    if (this.editor.editor_mode === 'edit') {
      pos_x =
        pos_x *
          (this.editor.precanvas.clientWidth /
            (this.editor.precanvas.clientWidth * this.editor.zoom)) -
        this.editor.precanvas.getBoundingClientRect().x *
          (this.editor.precanvas.clientWidth /
            (this.editor.precanvas.clientWidth * this.editor.zoom));

      pos_y =
        pos_y *
          (this.editor.precanvas.clientHeight /
            (this.editor.precanvas.clientHeight * this.editor.zoom)) -
        this.editor.precanvas.getBoundingClientRect().y *
          (this.editor.precanvas.clientHeight /
            (this.editor.precanvas.clientHeight * this.editor.zoom));
            const htmlTemplate = `
            <div>
              <div [formGroup]="formGorup">
              <textarea formControlName="test" df-template></textarea>
              </div>
              <app-text-area>
              </app-text-area>
            </div>
            `;
            const data = { template: "Write your text" }
            this.positionX = pos_x;
            this.positionY = pos_y

      const nodeName = this.selectedItem.name;
      
      //editor.addNode(name, inputs, outputs, posx, posy, class, data, html);
      //editor.addNode('welcome', 0, 0, 50, 50, 'welcome', {}, welcome );
      const nodeId = this.editor.addNode(
        this.selectedItem.name,
        this.selectedItem.inputs,
        this.selectedItem.outputs,
        pos_x,
        pos_y,
        'template',
        data,
        htmlTemplate,
        false
      );

      this.nodesDrawn.push({
        nodeId,
        nodeName,
      });

      // const newNode = <DrawflowNode>this.editor.getNodeFromId(nodeId);
    }
  }

  onClear() {
    this.editor.clear();
  }

  changeMode() {
    this.locked = !this.locked;
    this.editor.editor_mode = this.locked ? 'fixed' : 'edit';
  }

  onZoomOut() {
    this.editor.zoom_out();
  }

  onZoomIn() {
    this.editor.zoom_in();
  }

  onZoomReset() {
    this.editor.zoom_reset();
  }

  onSubmit() {
    const dataExport = this.editor.export();
    console.log('dataExport :>> ', dataExport);
  }

}
