import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Drawflow, {
  ConnectionEvent,
  ConnectionStartEvent,
  DrawFlowEditorMode,
  DrawflowConnection,
  DrawflowConnectionDetail,
  DrawflowNode,
  MousePositionEvent,
} from 'drawflow';
import { WorkflowListingComponent } from '../workflow-listing/workflow-listing.component';
import { NodeElement } from './node.model';

@Component({
  entryComponents: [WorkflowListingComponent],
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
  public selectedNodeFromId: any;
  drawFlowHtmlElement!: HTMLElement;
  public selectedItemId: number = 0;
  public positionX: number = 0;
  public positionY: number = 0;
  public formGroup!: FormGroup;
  public nodeSelection = [
    { id: 1, name: 'Single Output', inputs: 0, outputs: 1, },
    { id: 2, name: 'Single Input', inputs: 1, outputs: 0, },
    { id: 3, name: 'Single Input and Output', inputs: 1, outputs: 1, },
    { id: 4, name: 'Custom IO', inputs: 0, outputs: 0, },
  ]

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    public route: ActivatedRoute,
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
          data: {}
        },
      },
    };
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
      this.selectedNodeFromId = this.editor.getNodeFromId(id);
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
    this.initializeData();
  }

  public initializeData(): void {
    this.route.data.subscribe((data) => {
      if(data){
        this.formGroup.get('title')?.patchValue(this.route.snapshot.paramMap.get('name'));
      }
    });
  }

  public initializeFormGroup(): void {
    this.formGroup = new FormGroup({
      title: new FormControl('', Validators.required)
    })
  }

  // Drag Events
  onDragStart(e: any) {
    if (e.type === 'dragstart') {
      console.log('onDragStart :>> e :>> ', e);
      this.selectedItem = <NodeElement>(
        this.nodes.find((node: NodeElement) => node.name === e.target.outerText)
      );
      console.log(this.selectedItem);
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
      var data = e.dataTransfer.getData("data-node");
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


      const data = { template: `${this.selectedItem.name}` }
      this.positionX = pos_x;
      this.positionY = pos_y;
      const nodeName = this.selectedItem.name;

      switch (this.selectedItem.name){
        //CARD 1 (SINGLE OUTPUT)
        case 'Single Output':
          var singleOutput = `
            <textarea nz-input class="gold-card-textarea"  placeholder="Enter Text" maxlength="30" ></textarea>
          `;
          var nodeId = this.editor.addNode(
            this.selectedItem.name, this.selectedItem.inputs, this.selectedItem.outputs,
            pos_x, pos_y, 'gold-card', data,
            singleOutput, false
          );
          break;

        //CARD 2 (SINGLE INPUT)
        case 'Single Input':
          var singleInput = `
            <textarea nz-input rows="3" class="blue-card-textarea"  placeholder="Enter Text" nzBorderless ></textarea>
          `;
          var nodeId = this.editor.addNode(
            this.selectedItem.name, this.selectedItem.inputs, this.selectedItem.outputs,
            pos_x, pos_y, 'blue-card', data,
            singleInput, false
          );
          break;

        //CARD 3 (SINGLE INPUT AND OUTPUT)
        case 'Single Input and Output':
          var singleInputAndOutput = `
            <textarea nz-input rows="2" class="gold-card-textarea"  placeholder="Enter Text" nzBorderless ></textarea>
          `;
          var nodeId = this.editor.addNode(
            this.selectedItem.name, this.selectedItem.inputs, this.selectedItem.outputs,
            pos_x, pos_y, 'gold-card', data,
            singleInputAndOutput, false
          );
          break;

        //CARD 4 (Cutsom IO)
        case 'Custom IO':
          var customIO = `
            <textarea nz-input rows="2" class="gold-card-textarea"  placeholder="Enter Text" nzBorderless ></textarea>
          `;
          var nodeId = this.editor.addNode(
            this.selectedItem.name, this.selectedItem.inputs, this.selectedItem.outputs,
            pos_x, pos_y, 'gold-card', data,
            customIO, false
          );
          break;
      }


      this.nodesDrawn.push({
        nodeId,
        nodeName,
      });

    }
  }

  addImage(selectedItem: any): void {
    if(selectedItem){
      this.editor.drawflow.drawflow.Home.data[selectedItem.id].html = `<img src="https://www.w3schools.com/Tags/img_girl.jpg">`

      this.cdr.detectChanges()
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
