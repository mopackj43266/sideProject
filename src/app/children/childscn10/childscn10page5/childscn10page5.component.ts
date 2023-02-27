import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Childscn10Service } from '../childscn10.service';

@Component({
  selector: 'app-childscn10page5',
  templateUrl: './childscn10page5.component.html',
  styleUrls: ['./childscn10page5.component.css','../../../../assets/css/child.css']
})
export class Childscn10page5Component implements OnInit {

  constructor( private fb: FormBuilder,
    public pipe: DatePipe,
    private childscn10Service: Childscn10Service) { }

  EL_DSS_DECISION = new MatTableDataSource<any>();//官署資料決策
  applno:string;
  officialList : any[] = [];
  official= '';
  queryDate = "";//查詢時間
  initial = ''; //初始
  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.getOfficialList()
    this.trigger(this.initial)
  }


  DSSDataForm: FormGroup = this.fb.group({
    DSS_TN50: ['', []],//發查T50_YN
    DSS_TN51: ['', []],//發查T51_YN
    DSS_TN52: ['', []],//發查T52_YN
    DSS_TN53: ['', []],//發查T53_YN
    DSS_TN54: ['', []],//發查T54_YN
    DSS_INQR: ['', []],//DSS1回覆eloan階段
    DSS_LTST_CHNG_CD: ['', []],//勞保最新一筆資料異動代碼
    DSS_LTST_UNIT_NM: ['', []],//勞保最新一筆資料單位名稱工會類似文字判斷
    DSS_LTST_REC_NEW_YN: ['', []],//勞保最新一筆加保紀錄是否為近期
    DSS_JCIC: ['', []],//判斷JCIC特徵是否符合自動徵信條件
    DSS_JOB_CHNG_PRD_VAL: ['', []],//判斷工作轉換間空窗期大致連續
    DSS_JOB_MNTH_ENGH_VAL: ['', []],//判斷工作加保期間大於一定月數
    DSS_CMPY_NM: ['', []],//DSS勞保T52最新一筆單位名稱
    DSS_CMPY_LIST_YN: ['', []],//DSS勞保公司比對清單-是否為設置名單內
    DSS_JOB_CD: ['', []],//DSS勞保公司比對清單-對應之行職業代碼6bytes
    DSS_CPRS_JOB_CD: ['', []],//DSS客戶填寫公司比對清單-對應之行職業代碼6bytes
    DSS_T50_AMT: ['', []],//DSS財政部T50資料計算年收入(元)
    DSS_T52_AMT: ['', []],//DSS勞保T52資料計算年收入(元)
    DSS_Salary:['',[]],//DSS勞保T52最新一筆單位名稱_34月投保薪資
    DSS_frequency:['',[]],//T52最近一家公司_加保薪調次數
    DSS_L12:['',[]],//T52最近一家公司_加保薪調月投保薪資標準差L12
    DSS_L24:['',[]],//T52最近一家公司_加保薪調月投保薪資標準差L24
    DSS_T50_Pay:['',[]],//T50_給付總額合計
    DSS_T50_9A:['',[]],//T50_9A金額合計
    DSS_T50_T50:['',[]],//T50_50金額合計
    DSS_T50_employed:['',[]],//T50_受雇者其他項目合計
    DSS_CPRS_LIST_CD:['',[]],//DSS公司名單註記(DSS公司資料-設置名單內)
  })

  getData(i:string)
  {

    const url = 'f01/childscn10action9';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['dssType'] = i;
    this.childscn10Service.getDate_Json(url,jsonObject).subscribe(data => {
            // parseInt(data.rspBody.queryDate)
      if (data.rspBody!=null)
      {
        this.queryDate = this.pipe.transform(new Date(data.rspBody.queryDate), 'yyyy/MM/dd HH:mm:ss')
        this.DSSDataForm.patchValue({ DSS_INQR:data.rspBody.inqrGvmtDataVal })//DSS1回覆eloan階段
        this.DSSDataForm.patchValue({ DSS_TN50:data.rspBody.inqrT50Yn })//發查T50_YN
        this.DSSDataForm.patchValue({ DSS_TN51:data.rspBody.inqrT51Yn })//發查T51_YN
        this.DSSDataForm.patchValue({ DSS_TN52:data.rspBody.inqrT52Yn })//發查T52_YN
        this.DSSDataForm.patchValue({ DSS_TN53:data.rspBody.inqrT53Yn })//發查T53_YN
        this.DSSDataForm.patchValue({ DSS_TN54:data.rspBody.inqrT54Yn })//發查T54_YN

        this.DSSDataForm.patchValue({ DSS_LTST_CHNG_CD:data.rspBody.t52LtstChngCd })//勞保最新一筆資料異動代碼
        this.DSSDataForm.patchValue({ DSS_LTST_UNIT_NM:data.rspBody.t52LtstUnitNm })//勞保最新一筆資料單位名稱工會類似文字判斷
        this.DSSDataForm.patchValue({ DSS_LTST_REC_NEW_YN:data.rspBody.t52LtstRecNewYn })//勞保最新一筆加保紀錄是否為近期
        this.DSSDataForm.patchValue({ DSS_JCIC:data.rspBody.jcicFtrMtchAutoYn })//判斷JCIC特徵是否符合自動徵信條件
        this.DSSDataForm.patchValue({ DSS_JOB_CHNG_PRD_VAL:data.rspBody.t52JobChngPrdVal })//判斷工作轉換間空窗期大致連續
        this.DSSDataForm.patchValue({ DSS_JOB_MNTH_ENGH_VAL:data.rspBody.t52JobMnthEnghVal })//判斷工作加保期間大於一定月數

        this.DSSDataForm.patchValue({ DSS_CMPY_NM:data.rspBody.t52CmpyNm })//DSS勞保T52最新一筆單位名稱
        this.DSSDataForm.patchValue({ DSS_CMPY_LIST_YN:data.rspBody.t52CmpyListYn })//DSS勞保公司比對清單-是否為設置名單內

        this.DSSDataForm.patchValue({ DSS_JOB_CD:data.rspBody.t52JobCd })//DSS勞保公司比對清單-對應之行職業代碼6bytes
        this.DSSDataForm.patchValue({ DSS_CPRS_JOB_CD:data.rspBody.dssCprsJobCd })//DSS客戶填寫公司比對清單-對應之行職業代碼6bytes

        this.DSSDataForm.patchValue({ DSS_T52_AMT:this.data_number(data.rspBody.t52AnalAmt)})//DSS勞保T52資料計算年收入(元)
        this.DSSDataForm.patchValue({ DSS_Salary:this.data_number(data.rspBody.t52MnthAmt)})//DSS勞保T52最新一筆單位名稱_34月投保薪資
        this.DSSDataForm.patchValue({ DSS_frequency:data.rspBody.t52SlryAddCnt })//T52最近一家公司_加保薪調次數
        this.DSSDataForm.patchValue({ DSS_L12:this.data_number(data.rspBody.t52SlryAddStd12Val)})//T52最近一家公司_加保薪調月投保薪資標準差L12
        this.DSSDataForm.patchValue({ DSS_L24:this.data_number(data.rspBody.t52SlryAddStd24Val)})//T52最近一家公司_加保薪調月投保薪資標準差L24

        this.DSSDataForm.patchValue({ DSS_T50_AMT:this.data_number(data.rspBody.t50AnalAmt)})//DSS財政部T50資料計算年收入(元)
        this.DSSDataForm.patchValue({ DSS_T50_Pay:this.data_number(data.rspBody.t50AllAmt)})//T50_給付總額合計(元)
        this.DSSDataForm.patchValue({ DSS_T50_9A:this.data_number(data.rspBody.t50Slry9aAmt)})//T50_9A金額合計(元)
        this.DSSDataForm.patchValue({ DSS_T50_T50:this.data_number(data.rspBody.t50Slry50Amt)})//T50_50金額合計(元)
        this.DSSDataForm.patchValue({ DSS_T50_employed:this.data_number(data.rspBody.t50OthersCnt)})//T50_受雇者其他項目合計(元)

        this.DSSDataForm.patchValue({ DSS_CPRS_LIST_CD:data.rspBody.dssCprsListCd })//DSS公司名單註記(DSS公司資料-設置名單內)

      }
    })
  }

  data_number(p: number) {
    console.log(p)
    let t = '';
    t = (p + "")
    if (t != null && t!='null')
     {
      t = t.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    else
    {
      return '';
    }
    return t
  }
  getOfficialList()
  {
   this.officialList =  this.childscn10Service.getOfficialList()
   this.initial = this.officialList[0].value;
   this.official = this.officialList[0].value;

  }
  trigger(k:string)
  {
    this.getData(k);
  }
}
