import { DecimalPipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
  name: 'formatNumber'
})
export class FormatNumberPipe {
  transform(val: string, ...args: any[]) {
    const format = args[0] ? '1.0-2' : '1.0-0';
    return this.decimalPipe.transform(val, format);
  }

  constructor(private decimalPipe: DecimalPipe) { }
}

@Pipe({
  name: "toNumber"
})
export class ToNumberPipe implements PipeTransform  {
  transform(value: string) {
    return value && value.toString().replace(/,/g, '') || '';
  }
}

