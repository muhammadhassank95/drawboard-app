import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  Renderer2
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { DrawBoardService } from 'src/app/services/draw-board/draw-board.service';
import { WorkflowListingComponent } from '../workflow-listing/workflow-listing.component';
import { NodeElement } from './node.model';
import { lastValueFrom } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { GENERATED_ID } from 'src/app/utilities/uuid.utility';

@Component({
  entryComponents: [WorkflowListingComponent],
  selector: 'app-draw-board',
  templateUrl: './draw-board.component.html',
  styleUrls: ['./draw-board.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DrawBoardComponent implements OnInit, AfterViewInit {
  nodes: NodeElement[] = [];
  nodesHTML!: NodeListOf<Element>;
  @ViewChild('txtArea', {static: true}) txtArea!: TemplateRef<any>;
  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;

  nodesDrawn: any[] = [];
  selectedItem!: NodeElement;
  editor!: any;

  locked: boolean = false;
  gridToggle: boolean = false;

  lastMousePositionEv: any;
  public selectedNodeFromId: any;
  drawFlowHtmlElement!: HTMLElement;
  public selectedItemId: number = 0;
  public positionX: number = 0;
  public positionY: number = 0;
  public formGroup!: FormGroup;
  public tags = ['test'];
  public inputVisible = false;
  public inputValue = '';
  public diagramTags: any = new FormArray([]);
  public canvasData: any;
  public diagramByIdResponse: any;
  public isEdit: boolean = false;
  public diagramId: string = '';
  public isEditInput: boolean = false;
  public selectedItemname: string = '';
  public currentDiagramHeight: string = '';
  public selectedNodeToSave: any;
  public currentZoomValue: number = 1;
  public selectedNodeIdEl: string = '';
  public nodeSelection = [
    { id: 1, name: 'singleOut', inputs: 0, outputs: 1, imgPath: 'assets/image/single-out.png' },
    { id: 2, name: 'singleInOut', inputs: 1, outputs: 1, imgPath: 'assets/image/single-in-out.png' },
    { id: 3, name: 'singleInRed', inputs: 0, outputs: 0, imgPath: 'assets/image/no-node-red.png'},
    { id: 4, name: 'singleInGreen', inputs: 0, outputs: 0, imgPath: 'assets/image/no-node-green.png'},
    { id: 5, name: 'singleInOrg', inputs: 1, outputs: 0, imgPath: 'assets/image/single-in-org.png'},
    { id: 6, name: 'singleInBlue', inputs: 1, outputs: 0, imgPath: 'assets/image/single-in-blue.png'},
  ]

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    public route: ActivatedRoute,
    public drawBoardService: DrawBoardService,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer2: Renderer2,
    private notification: NzNotificationService,
  ) {}

  public onEventListener(selectedName: any): void {
    const element = document.getElementById(this.selectedItemname);
    this.editor.drawflow.drawflow.Home.data[selectedName.id].html = element?.outerHTML;
  }

  public back(): void {
    this.router.navigateByUrl('');
  }

  public showInputOnClick(): void {
    console.log("isEdit: "+ this.isEdit+ " isEditInput: "+ this.isEditInput)
    this.isEditInput = !this.isEditInput;
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

  private initDrawFlow(htmlElement: HTMLElement, diagramData?: any): void {
    this.editor = new Drawflow(htmlElement);
    this.editor.reroute = true;
    this.editor.reroute_fix_curvature = true;
    this.editor.force_first_input = false;
    this.editor.start();
    let dataToImport: any;
    if(diagramData){
      dataToImport = {
        drawflow: this.canvasData,
      };
    } else {
      dataToImport = {
        drawflow: {
          Home: {
            data: {}
          },
        },
      }
    }
    this.editor.import(dataToImport);
  }

  async ngAfterViewInit(): Promise<void> {
    this.drawFlowHtmlElement = <HTMLElement>document.getElementById('drawflow');
    const hehe = await this.initializeData();
    this.route.data.subscribe(async (data) => {
      if(this.route.snapshot.paramMap.get('id')){
        this.isEdit = true;
        const responsezz = this.drawBoardService.getDiagramByid(this.route.snapshot.paramMap.get('id')!)
        this.diagramByIdResponse = await lastValueFrom(responsezz);
        if(this.diagramByIdResponse){
          this.canvasData = JSON.parse(this.diagramByIdResponse.data);
          // this.editor.zoom = this.canvasData.zoomValue;
          this.formGroup.get('title')?.patchValue(this.diagramByIdResponse.name);
          this.diagramByIdResponse.tags.forEach((tag: any) => {
            this.diagramTags.push(new FormControl(tag.name));
          })
        }
      }

        this.initDrawFlow(this.drawFlowHtmlElement, this.canvasData);
        this.editor.draggable_inputs = false;
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
          const item = this.editor.getNodeFromId(id);
          this.selectedNodeToSave = item;
          const htmlDom = new DOMParser().parseFromString(item.html, 'text/html');
          const htmlDomId = htmlDom.getElementsByTagName("textarea")[0].id;
          this.selectedItemname = htmlDomId;
          this.selectedNodeFromId = this.editor.getNodeFromId(id);

          setTimeout(() => {
            let htmlCollection = document.getElementsByClassName('selected')[0].id;
            this.selectedNodeIdEl = htmlCollection;            
            console.error('haha',htmlCollection)       
          })

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

        this.editor.on('nodeUnselected', (connection: boolean) => {
          this.onEventListener(this.selectedNodeToSave);
          this.editor.reroute_fix_curvature = true;
          console.error('this.selectedNodeToSave',this.selectedNodeToSave)
          console.error('this.selectedNodeToSave B',this.selectedItemname)
          setTimeout(() => {
            this.editor.updateConnectionNodes(this.selectedNodeIdEl);
          },100)
          // this.editor.import(this.editor.export())
        });

        // this.editor.on('mouseMove', (position: any) => {
        //   console.log('Editor Event :>> Position mouse x:' + position.x + ' y:' + position.y);
        // });

        this.editor.on('nodeMoved', (id: any) => {
          console.log('Editor Event :>> Node moved ' + id);
        });

        this.editor.on('zoom', (zoom: any) => {
          this.currentZoomValue = zoom;
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
    });
  }

  ngOnInit(): void {
    this.initializeList(5);
    this.initializeFormGroup();
  }

  public async initializeData() {
    let apiResponse: any

    return apiResponse;
  }

  public initializeFormGroup(): void {
    this.formGroup = new FormGroup({
      title: new FormControl('', Validators.required),
      tags: new FormControl('',)
    })
  }

  // Drag Events
  onDragStart(e: any) {
    if (e.type === 'dragstart') {
      console.log('onDragStart :>> e :>> ', e);
      this.selectedItem = <NodeElement>(
        this.nodes.find((node: NodeElement) => node.id === parseInt(e.target.id))
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
      e.preventDefault();
      // var data = e.dataTransfer.getData("data-node");
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
            // const htmlTemplate = '\n          <div [formGroup]="formGorup">\n           <input formControlName="test" />\n   <app-workflow-listing>\n</app-workflow-listing>\n       </div>\n          ';
            // const htmlTemplate = `
            // <div >
            //   <div class="${this.selectedItem.name}">
            //     <textarea id="textarea" df-template style="border: 1px solid #ccc; padding: 3px 8px;"></textarea>
            //   </div>
            // </div>
            // `;


      const data = { template: `` }
      this.positionX = pos_x;
      this.positionY = pos_y;
      const nodeName = this.selectedItem.name;

      switch (this.selectedItem.name){
        //CARD 1 (SINGLE OUTPUT)
        case 'singleOut':
          var singleOutput = `
            <textarea id="${GENERATED_ID()}" class="mani-card-textarea" placeholder="Enter Text" df-template></textarea>
          `;
          var nodeId = this.editor.addNode(
            this.selectedItem.name, this.selectedItem.inputs, this.selectedItem.outputs,
            pos_x, pos_y, 'mani-card', data,
            singleOutput, false
          );
          break;

        //CARD 2 (SINGLE INPUT AND OUTPUT)
        case 'singleInOut':
          var singleInputAndOutput = `
            <div id="openModal">
              <button>
                click me!
              </button> 
            </div>
            <textarea id="${GENERATED_ID()}" class="mani-card-textarea" placeholder="Enter Text" df-template></textarea>
          `;
          var nodeId = this.editor.addNode(
            this.selectedItem.name, this.selectedItem.inputs, this.selectedItem.outputs,
            pos_x, pos_y, 'mani-card', data,
            singleInputAndOutput, false
          );
          break;

        //CARD 3 (SINGLE INPUT RED)
        case 'singleInRed':
          var singleInputAndOutput = `
            <textarea id="${GENERATED_ID()}" class="red-card-textarea" placeholder="Enter Text" df-template></textarea>
          `;
          var nodeId = this.editor.addNode(
            this.selectedItem.name, this.selectedItem.inputs, this.selectedItem.outputs,
            pos_x, pos_y, 'red-card', data,
            singleInputAndOutput, false
          );
          break;

        //CARD 4 (SINGLE INPUT GREEN)
        case 'singleInGreen':
          var singleInputAndOutput = `
            <textarea id="${GENERATED_ID()}" class="green-card-textarea" placeholder="Enter Text" df-template></textarea>
          `;
          var nodeId = this.editor.addNode(
            this.selectedItem.name, this.selectedItem.inputs, this.selectedItem.outputs,
            pos_x, pos_y, 'green-card', data,
            singleInputAndOutput, false
          );
          break;

        //CARD 5 (SINGLE INPUT ORANGE)
        case 'singleInOrg':
          var singleInputAndOutput = `
            <textarea id="${GENERATED_ID()}" class="org-card-textarea" placeholder="Enter Text" df-template></textarea>
          `;
          var nodeId = this.editor.addNode(
            this.selectedItem.name, this.selectedItem.inputs, this.selectedItem.outputs,
            pos_x, pos_y, 'org-card', data,
            singleInputAndOutput, false
          );
          break;
        //CARD 6 (SINGLE INPUT BLUE)
        case 'singleInBlue':
          var singleInputAndOutput = `
            <textarea id="${GENERATED_ID()}" class="blue-card-textarea" placeholder="Enter Text" df-template></textarea>
          `;
          var nodeId = this.editor.addNode(
            this.selectedItem.name, this.selectedItem.inputs, this.selectedItem.outputs,
            pos_x, pos_y, 'blue-card', data,
            singleInputAndOutput, false
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
    // this.editor.drawflow.drawflow.zoomValue = this.currentZoomValue;
    const payload = {
      name: this.formGroup.value.title,
      data: JSON.stringify(this.editor.drawflow.drawflow),
      tags: this.diagramTags.value
    }
    console.error('dataExport.drawflow',this.editor.drawflow.drawflow)
    if(this.formGroup.valid){
      if(this.isEdit){
        this.drawBoardService.updateDiagram(this.route.snapshot.paramMap.get('id')!,payload).subscribe((response: any) => {
          if(response.status === 'Success'){
            this.createNotification('success', "FMEA Saved.");
          } else {
            this.createNotification('error', "Something went wrong..");
          }
        })
      } else {
        this.drawBoardService.addDiagram(payload).subscribe((response: any) => {
          if(response.status === 'Success'){
            this.createNotification('success', "FMEA Created.");
          } else {
            this.createNotification('error', "Something went wrong..");
          }
        })
      }
    } else {
      this.createNotification('error', "Title needed to save FMEA.");
      this.formGroup.markAllAsTouched();
    }
  }


  handleClose(removedTag: {}): void {
    this.tags = this.tags.filter(tag => tag !== removedTag);
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement?.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(): void {
    if (this.inputValue && this.tags.indexOf(this.inputValue) === -1) {
      this.diagramTags.push(new FormControl(this.inputValue, Validators.required));
    }
    this.inputValue = '';
    this.inputVisible = false;
  }

  toggleGrid(){
    this.gridToggle = !this.gridToggle;
  }

  getGridStyle(){
    if(this.gridToggle){
      let style = {
        'background-size': '25px 25px',
        'background-image': 'linear-gradient(to right, #f1f1f1 1px, transparent 1px), linear-gradient(to bottom, #f1f1f1 1px, transparent 1px)'
      }
      return(style);
    }
    else return(null);

  }

  createNotification(type: string, msgText: string){
    this.notification.create(type, msgText, '', {
      nzPlacement:'bottom',
    })
  }



}

