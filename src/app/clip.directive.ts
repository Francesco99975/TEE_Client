import { Directive, Input, Output, EventEmitter, HostListener } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Directive({ selector: '[copy-clipboard]' })
export class ClipDirective {

  constructor(private toastr: ToastrService) {}

  @Input("copy-clipboard")
  public payload!: string;

  @Output("copied")
  public copied: EventEmitter<string> = new EventEmitter<string>();

  @HostListener("click", ["$event"])
  public onClick(event: MouseEvent): void {

    event.preventDefault();
    if (!this.payload)
      return;

    let listener = (e: ClipboardEvent) => {
      let clipboard = e.clipboardData;
      clipboard?.setData("text", this.payload.toString());
      e.preventDefault();

      this.copied.emit(this.payload);
    };

    document.addEventListener("copy", listener, false)
    document.execCommand("copy");
    document.removeEventListener("copy", listener, false);
    this.toastr.success("Text Copied to Clipboard!", "Copied!", {timeOut: 3000});
  }
}
