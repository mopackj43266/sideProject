import {Component, OnInit} from '@angular/core'
import {FormGroup, FormBuilder} from '@angular/forms'
import {OptionsCode} from 'src/app/interface/base'
import {Childbwscn2Service} from '../childbwscn2.service'
import {MatTableDataSource} from '@angular/material/table'
import { NzI18nService, zh_TW } from 'ng-zorro-antd/i18n'

@Component({
	selector: 'app-childscn10page3',
	templateUrl: './childbwscn2page2.component.html',
	styleUrls: ['./childbwscn2page2.component.css', '../../../../assets/css/child.css'],
})
export class childbwscn2page2Component implements OnInit {
	BW_DSS4_RISKDSUB_LIST =[] //風險模型變數設定
	dateCode: OptionsCode[] = []
	dateValue: string

	constructor(
    private fb: FormBuilder,
    private childbwscn2Service: Childbwscn2Service,
    private nzI18nService: NzI18nService) {
    this.nzI18nService.setLocale(zh_TW)
  }

  private applno: string;
  loading = true;

  DSS4_DataSource = new MatTableDataSource<any>();//風險模型資訊
  BW_DSS4_RISKDSUB = new MatTableDataSource<any>();//風險模型變數資訊

  DSS4DataForm: FormGroup = this.fb.group({
    RISKMDGRAD_DIFF: ['', []],//與上次等級差距(策略調整後)
    RV_RISKMDSUB: ['', []],//子模型
    RV_RISKMDSCORE: ['', []],//分數
    RV_RISKMDGRADE: ['', []],//等級
    RV_RISKMDGRADE_ADJ: ['', []],//等級(策略調整後)
    RV_RISKMDGRADE_GP: ['', []],//分群
    RV_RISKMDGRADE_GP_ADJ: ['', []],//分群(策略調整後)
  })

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.getData();
  }

  //取Table
  getData() {
    const url = 'f01/childBwScn2action1';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    this.childbwscn2Service.getDate_Json(url, jsonObject).subscribe(data => {
      if (data.rspBody.bwDss4List.length > 0) {
        this.DSS4_DataSource.data = data.rspBody.bwDss4List
        //系統決策
        this.DSS4DataForm.patchValue({ RISKMDGRAD_DIFF: data.rspBody.bwDss4List[0].riskmdgradDiff })//風險模型子模型代碼
        this.DSS4DataForm.patchValue({ RV_RISKMDSUB: data.rspBody.bwDss4List[0].rvRiskmdsub })//風險模型子模型說明
        this.DSS4DataForm.patchValue({ RV_RISKMDSCORE: data.rspBody.bwDss4List[0].rvRiskmdscore })//風險模型分數
        this.DSS4DataForm.patchValue({ RV_RISKMDGRADE: data.rspBody.bwDss4List[0].rvRiskmdgrade })//風險模型等級
        this.DSS4DataForm.patchValue({ RV_RISKMDGRADE_ADJ: data.rspBody.bwDss4List[0].rvRiskmdgradeAdj })//風險模型等級分群
        this.DSS4DataForm.patchValue({ RV_RISKMDGRADE_GP: data.rspBody.bwDss4List[0].rvRiskmdgradeGp })//風險模型等級(策略調整後)
        this.DSS4DataForm.patchValue({ RV_RISKMDGRADE_GP_ADJ: data.rspBody.bwDss4List[0].rvRiskmdgradeGpAdj })//風險模型等級分群(策略調整後)
      }
      this.BW_DSS4_RISKDSUB.data = data.rspBody.Dss4Riskdsub;
    });
  }


}
