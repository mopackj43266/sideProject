import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';
import { DataItem, JCICCode, JCICTable } from 'src/app/interface/base';
@Injectable({
  providedIn: 'root'
})
export class F01008scn3Service extends BaseService {

  constructor(protected httpClient: HttpClient) { super(httpClient); }
  getJCICSearch(json: JSON): Observable<any> {
    const baseUrl = 'f01/f01008scn3action1';
    return this.postJsonObject(baseUrl, json);
  }

  getDate(baseUrl: string, json: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, json);
  }

  getMASTERJCICSearch(json: JSON): Observable<any> {
    const baseUrl = 'f01/f01008scn3action2';
    return this.postJsonObject(baseUrl, json);
  }
  getMASTERJCICList(json: JSON): Observable<any> {
    const baseUrl = 'f01/childscn6action3';
    return this.postJsonObject(baseUrl, json);
  }

  getTableData(code: JCICCode): JCICTable {
    let dataList: DataItem[];
    let title: string;
    let nzScroll: string;
    // BAM061
    if (code === JCICCode.BAM061) {
      dataList = [
        { name: '資料日期', bodyKey: 'DATA_DATE' },
        { name: '報送機構代號', bodyKey: 'MAIN_CODE' },
        { name: '報送機構名稱', bodyKey: 'MAIN_NAME' },
        { name: '中文姓名', bodyKey: 'CNAME' },
        { name: '出生日期', bodyKey: 'BIRTH_DATE' },
        { name: '教育程度代號', bodyKey: 'EDU_CODE' },
        { name: '戶籍地址', bodyKey: 'R_ADDR' },
        { name: '聯絡地址', bodyKey: 'M_ADDR' },
        { name: '自有住宅有無', bodyKey: 'H_CODE' },
        { name: '居住電話', bodyKey: 'H_TEL' },
        { name: '行動電話', bodyKey: 'M_TEL' },
        { name: '任職機構電話', bodyKey: 'O_TEL' },
        { name: '任職機構名稱', bodyKey: 'O_NAME' },
        { name: '職位名稱', bodyKey: 'TITLE' },
        { name: '服務年資', bodyKey: 'SRV_YR' },
        { name: '年薪(千元)', bodyKey: 'SALARY' },
      ];
      title = 'BAM061 授信戶基本資料(多筆B67)'
    }
    // KRM043
    if (code === JCICCode.KRM043) {
      dataList = [
        { name: '身分證號/統編', bodyKey: 'IDN_BAN', width: '200px', nzLeft: true },
        { name: '資料日期', bodyKey: 'DATA_DATE', width: '200px' },
        { name: '報送機構代號', bodyKey: 'ISSUE', width: '200px' },
        { name: '報送機構名稱', bodyKey: 'ISSUE_NAME', width: '200px' },
        { name: '中文姓名/戶名', bodyKey: 'CNAME', width: '200px' },
        { name: '英文姓名/戶名', bodyKey: 'ENAME', width: '200px' },
        { name: '出生/設立日期', bodyKey: 'BIRTH', width: '200px' },
        { name: '教育程度代碼', bodyKey: 'EDU_CODE', width: '200px' },
        { name: '教育程度名稱', bodyKey: 'EDU_NAME', width: '200px' },
        { name: '戶籍地址', bodyKey: 'RADDR', width: '200px' },
        { name: '寄單地址', bodyKey: 'MADDR', width: '200px' },
        { name: '有無自有住宅/營業場所', bodyKey: 'H_CODE', width: '200px' },
        { name: '居住/營業電話', bodyKey: 'H_TEL', width: '200px' },
        { name: '任職電話', bodyKey: 'O_TEL', width: '200px' },
        { name: '行動電話', bodyKey: 'M_TEL', width: '200px' },
        { name: '任職機構', bodyKey: 'ONAME', width: '200px' },
        { name: '職稱', bodyKey: 'TITLE', width: '200px' },
        { name: '職業類別代碼', bodyKey: 'PROS_CODE', width: '200px' },
        { name: '職業類別名稱', bodyKey: 'PROS_NAME', width: '200px' },
        { name: '年薪/營業額(千元)', bodyKey: 'SALARY', width: '200px' },
        { name: '服務年資/營業年數', bodyKey: 'SENIOR', width: '200px', nzRight: true },
      ];
      title = 'KRM043 信用卡戶基本資訊彙總(多筆K22)',
        nzScroll = '1500px'
    }
    // BAM062
    if (code === JCICCode.BAM062) {
      dataList = [
        { name: '行庫代號', bodyKey: 'MAIN_CODE' },
        { name: '行庫名稱', bodyKey: 'BANK_NAME' },
        { name: '資類種類(Y:現金卡 B:授信 C:信用卡)', bodyKey: 'DATA_TYPE' },
        { name: '年收入資料年月', bodyKey: 'DATA_YYYMM' },
        { name: '年收入(仟元)', bodyKey: 'SALARY' },
        { name: '資料更新年月', bodyKey: 'UPD_YYYMM' },
      ];
      title = 'BAM062 最近二年年收入資訊(多筆B68)'
    }
    // BAM501
    if (code === JCICCode.BAM501) {
      dataList = [
        { name: '行庫代號', bodyKey: 'MAIN_CODE' },
        { name: '行庫名稱', bodyKey: 'BANK_NAME' },
        { name: '無擔保放款(仟元)', bodyKey: 'B_AMT' },
        { name: '現金卡放款(仟元)', bodyKey: 'Y_AMT' },
        { name: '信用卡循環信用(仟元)', bodyKey: 'C1_AMT' },
        { name: '未到期待付款(仟元)', bodyKey: 'C2_AMT' },
      ];
      title = 'BAM501 應計入DBR22倍規範之無擔保債務餘額彙總(多筆B68)'
    }
    // BAM502
    if (code === JCICCode.BAM502) {
      dataList = [
        { name: '信用保險註記', bodyKey: 'MARK' },
        { name: '行庫代號', bodyKey: 'BANK_CODE' },
        { name: '行庫名稱', bodyKey: 'BANK_NAME' },
        { name: '科目別', bodyKey: 'ACCOUNT_CODE' },
        { name: '科目別註記', bodyKey: 'ACCOUNT_CODE2' },
        { name: '用途別', bodyKey: 'PURPOSE_CODE' },
        { name: '未逾期金額(仟元)', bodyKey: 'LOAN_AMT' },
        { name: '逾期金額(仟元)', bodyKey: 'PASS_DUE_AMT' },
      ];
      title = 'BAM502 應計入DBR22倍規範之無擔保放款明細(多筆B68)'
    }
    // BAM504
    if (code === JCICCode.BAM504) {
      dataList = [
        { name: '資料年度', bodyKey: 'DATA_YYY' },
        { name: '資料月份', bodyKey: 'DATA_MM' },
        { name: '行庫代號', bodyKey: 'BANK_CODE' },
        { name: '行庫名稱', bodyKey: 'BANK_NAME' },
        { name: '金額(千元)', bodyKey: 'AMT' },
      ];
      title = 'BAM504 應計入DBR22倍規範之貸款餘額(應計入DBR22倍規範之貸款餘額(擔保放款餘額加上部分擔保、負擔保貸款餘額)扣除擔保品鑑估值之金額彙總)'
    }
    // BAM505
    if (code === JCICCode.BAM505) {
      dataList = [
        { name: '日期', bodyKey: 'DATA_DATE' },
        { name: '行庫代號', bodyKey: 'BANK_CODE' },
        { name: '行庫名稱', bodyKey: 'BANK_NAME' },
        { name: '新增核准額度訂約金額(千元)', bodyKey: 'CONTRACT_AMT' },
        { name: '應計入DBR22倍規範之金額(千元)', bodyKey: 'DBR22_AMT' },
      ];
      title = 'BAM505 新增核准額度中應計入DBR22倍之金額明細(多筆B68)'
    }
    // BAM032
    if (code === JCICCode.BAM032) {
      dataList = [
        { name: '交易日期', bodyKey: 'TRAN_DATE' },
        { name: '行庫代號', bodyKey: 'BANK_CODE' },
        { name: '行庫名稱', bodyKey: 'BANK_NAME' },
        { name: '餘額增加金額(千元)', bodyKey: 'PAY_AMT' },
        { name: '最新授信餘額(千元)', bodyKey: 'BAL_AMT' },
        { name: '授信科目', bodyKey: 'ACCOUNT_CODE' },
        { name: '科目別註記', bodyKey: 'ACCOUNT_CODE2' },
        { name: '授信科目名稱', bodyKey: 'ACCOUNT_NAME' },
        { name: '用途別', bodyKey: 'PURPOSE_CODE' },
        { name: '本筆交易後之還款紀錄', bodyKey: 'PAY_CODE' },
        { name: '個人消費性貸款註記', bodyKey: 'CONSUMER_FLAG' },
      ];
      title = 'BAM032 每日授信餘額變動資訊-餘額增加(含撥款及轉(多筆，每日授信餘額變動資訊-餘額增加(含撥款及轉列為催收呆帳)))'
    }
    //BAM033
    if (code === JCICCode.BAM033) {
      dataList = [
        { name: '交易日期', bodyKey: 'TRAN_DATE' },
        { name: '行庫代號', bodyKey: 'BANK_CODE' },
        { name: '行庫名稱', bodyKey: 'BANK_NAME' },
        { name: '餘額減少金額（千元）', bodyKey: 'PAY_AMT' },
        { name: '最新授信餘額(千元)', bodyKey: 'BAL_AMT' },
        { name: '授信科目', bodyKey: 'ACCOUNT_CODE' },
        { name: '科目別註記', bodyKey: 'ACCOUNT_CODE2' },
        { name: '授信科目名稱', bodyKey: 'ACCOUNT_NAME' },
        { name: '用途別', bodyKey: 'PURPOSE_CODE' },
        { name: '本筆交易後之還款紀錄', bodyKey: 'PAY_CODE' },
        { name: '個人消費性貸款註記', bodyKey: 'CONSUMER_FLAG' },
      ];
      title = 'BAM033 每日授信餘額變動資訊-餘額減少(含還款及未(多筆，每日授信餘額變動資訊-餘額減少(含還款及未還款之還款紀錄異動)))'
    }
    //BAM034
    if (code === JCICCode.BAM034) {
      dataList = [
        { name: '交易日期', bodyKey: 'TRAN_DATE' },
        { name: '行庫代號', bodyKey: 'BANK_CODE' },
        { name: '行庫名稱', bodyKey: 'BANK_NAME' },
        { name: '餘額增加金額（千元）', bodyKey: 'PAY_AMT' },
        { name: '最新授信餘額(千元)', bodyKey: 'BAL_AMT' },
        { name: '授信科目', bodyKey: 'ACCOUNT_CODE' },
        { name: '科目別註記', bodyKey: 'ACCOUNT_CODE2' },
        { name: '授信科目名稱', bodyKey: 'ACCOUNT_NAME' },
        { name: '用途別', bodyKey: 'PURPOSE_CODE' },
        { name: '本筆交易後之還款紀錄', bodyKey: 'PAY_CODE' },
        { name: '個人消費性貸款註記', bodyKey: 'CONSUMER_FLAG' },
      ];
      title = 'BAM034 每日授信餘額變動資訊-債權結案'
    }
    //BAS010
    if (code === JCICCode.BAS010) {
      dataList = [
        { name: '最新授信總餘額（千元）', bodyKey: 'TOT_BAL_AMT' },
      ];
      title = 'BAS010 截至查詢當日止金融機構報送之最新授信總餘'
    }
    // BAM029
    if (code === JCICCode.BAM029) {
      dataList = [
        { name: '新增核准額度日期/清償日期/到期或解約日期', bodyKey: 'PAY_LOAN_DATE', width: '300px', nzLeft: true },
        { name: '行庫代號', bodyKey: 'BANK_CODE', width: '150px' },
        { name: '行庫名稱', bodyKey: 'BANK_NAME', width: '150px' },
        { name: '交易別', bodyKey: 'XACT_CODE', width: '150px' },
        { name: '科目別', bodyKey: 'ACCOUNT_CODE', width: '150px' },
        { name: '科目別註記', bodyKey: 'ACCOUNT_CODE2', width: '150px' },
        { name: '清償時最新授信月底餘額-未逾期金額(千元)', bodyKey: 'LASTMON_LOAN_AMT', width: '300px' },
        { name: '清償時最新授信月底餘額-逾期金額(千元)', bodyKey: 'LASTMON_PASS_DUE_AMT', width: '300px' },
        { name: '訂約金額(千元)', bodyKey: 'NEW_CONTRACT_AMT', width: '150px' },
        { name: '當日動撥金額(千元)', bodyKey: 'NEW_LOAN_AMT', width: '150px' },
        { name: '清償金額(千元)', bodyKey: 'NEW_PAY_LOAN_AMT', width: '150px' },
        { name: '應計入DBR22倍規範之金額(千元)', bodyKey: 'NEW_DBR22_AMT', width: '300px', nzRight: true },
      ];
      title = 'BAM029 新增額度(含應計入DBR22倍金額)及清償資訊(多筆B29)',
        nzScroll = '1500px'
    }
    // STM022
    if (code === JCICCode.STM022) {
      dataList = [
        { name: '查詢日期', bodyKey: 'JCIC_QUERY_DATE' },
        { name: '查詢單位代號', bodyKey: 'BANK_CODE' },
        { name: '查詢單位名稱', bodyKey: 'BANK_NAME' },
        { name: '查詢項目串列', bodyKey: 'ITEM_LIST' },
        { name: '查詢理由碼', bodyKey: 'INQ_PURPOSE_1' },
        { name: '查詢理由碼(中文註解)', bodyKey: 'INQ_PURPOSE' },
      ];
      title = 'STM022 近一年內不含查詢當日非Z類被查詢紀錄明細(多筆)'
    }
    // STM008
    if (code === JCICCode.STM008) {
      dataList = [
        { name: '查詢單位代號', bodyKey: 'BANK_CODE' },
        { name: '查詢單位名稱', bodyKey: 'BANK_NAME' },
        { name: '查詢理由碼', bodyKey: 'INQ_PURPOSE_1' },
        { name: '查詢理由碼(中文註解)', bodyKey: 'INQ_PURPOSE' },
      ];
      title = 'STM008 當日非Z類產品被查詢紀錄(多筆)'
    }
    // STM025
    if (code === JCICCode.STM025) {
      dataList = [
        { name: '查詢日期', bodyKey: 'JCIC_QUERY_DATE' },
        { name: '申請方式', bodyKey: 'APPLY_WAY' },
        { name: '是否本人親臨', bodyKey: 'IS_SELF' },
        { name: '申請原因代碼1', bodyKey: 'REASON1' },
        { name: '申請原因1', bodyKey: 'REASON_NAME1' },
        { name: '申請原因代碼2', bodyKey: 'REASON2' },
        { name: '申請原因2', bodyKey: 'REASON_NAME2' },
        { name: '受託人身分證號', bodyKey: 'APPLICANT' },
        { name: '受託人姓名', bodyKey: 'NAME' },
      ];
      title = 'STM025 最近一年內當事人申請查詢紀錄明細(多筆)'
    }
    // BAM421
    if (code === JCICCode.BAM421) {
      dataList = [
        { name: '資料年度', bodyKey: 'DATA_YYY', width: '90px', nzLeft: true },
        { name: '資料月份', bodyKey: 'DATA_MM', width: '90px' },
        { name: '行庫代號', bodyKey: 'BANK_CODE', width: '90px' },
        { name: '行庫名稱', bodyKey: 'BANK_NAME', width: '90px' },
        { name: '科目別', bodyKey: 'ACCOUNT_CODE', width: '90px' },
        { name: '科目別註記', bodyKey: 'ACCOUNT_CODE2', width: '90px' },
        { name: '用途別', bodyKey: 'PURPOSE_CODE', width: '90px' },
        { name: '綜合額度金額(千元)', bodyKey: 'CONTRACT_AMT1', width: '150px' },
        { name: '分項額度金額(千元)', bodyKey: 'CONTRACT_AMT', width: '150px' },
        { name: '未逾期金額(千元)', bodyKey: 'LOAN_AMT', width: '170px' },
        { name: '逾期未還金額(千元)', bodyKey: 'PASS_DUE_AMT', width: '150px' },
        { name: '12期還款記錄', bodyKey: 'PAY_CODE_12', width: '120px' },
        { name: '擔保品類別', bodyKey: 'IS_KIND', width: '90px' },
        { name: '政府專案貸款分類代碼', bodyKey: 'PROJECT_CODE', width: '170px' },
        { name: '共同借款註記(* 表有共同借款)', bodyKey: 'CO_LOAN', width: '300px' },
        { name: '聯貸註記(A 表國內, B 表國際聯貸)', bodyKey: 'UN_MARK', width: '300px' },
        { name: '聯貸日期', bodyKey: 'U_YYYMMDD', width: '90px' },
        { name: '參貸比例', bodyKey: 'U_RATE', width: '90px' },
        { name: '資金流向註記(* 表流向非法人組織)', bodyKey: 'IB_MARK', width: '300px' },
        { name: '資金流向非法人組織 統編', bodyKey: 'IAB_BAN', width: '180px' },
        { name: '資金流向非法人組織 名稱', bodyKey: 'IAB_NAME', width: '180px' },
        { name: '額度特別註記(* 表最高階額度所有者ID不同)', bodyKey: 'CONTRACT_MARK', width: '300px' },
        { name: '本階額度代碼', bodyKey: 'CONTRACT_CODE', width: '120px' },
        { name: '最高階額度代碼', bodyKey: 'CONTRACT_CODE1', width: '170px' },
        { name: '最高階額度所屬公司統編', bodyKey: 'CON_BAN', width: '200px' },
        { name: '最高階額度所屬公司名稱', bodyKey: 'CON_NAME', width: '200px' },
        { name: 'Ｙ科目之額度註記(* 表有現金卡日報資料)', bodyKey: 'ACT_Y_MARK', width: '300px' },
        { name: '現金卡日報Ｙ科目之可動用額度(千元)', bodyKey: 'CONTRACT_AMT_Y', width: '300px' },
        { name: '授信1千元之原始金額', bodyKey: 'AC_AMT', width: '200px' },
        { name: '債權證券化資料年', bodyKey: 'ASST_DATA_YYY', width: '150px' },
        { name: '債權證券化資料月', bodyKey: 'ASST_DATA_MM', width: '150px' },
        { name: '債權證券化受託機構統一編號', bodyKey: 'ASST_IDN_BAN', width: '200px' },
        { name: '債權證券化受託機構名稱', bodyKey: 'ASST_NAME', width: '200px' },
        { name: '幣別代號', bodyKey: 'CURRENCY_CODE_3', width: '90px' },
        { name: '循環信用註記', bodyKey: 'CYCLE_FLAG', width: '130px' },
        { name: '額度可否撤銷', bodyKey: 'OFF_FLAG', width: '130px' },
        { name: '房貸業務分類', bodyKey: 'LOAN_TYPE', width: '130px' },
        { name: '擔保品所在地一', bodyKey: 'LOCATE_NM_1', width: '120px' },
        { name: '擔保品所在地二', bodyKey: 'LOCATE_NM_2', width: '120px' },
        { name: '擔保品所在地三', bodyKey: 'LOCATE_NM_3', width: '120px' },
        { name: '房貸寬限期起始年月', bodyKey: 'GRACE_PERIOD_SDATE', width: '120px' },
        { name: '房貸寬限期截止年月', bodyKey: 'GRACE_PERIOD_EDATE', width: '120px', nzRight: true },
      ];
      title = 'BAM421 綜合授信、房貸業務分類及擔保品資訊(多筆B42)',
        nzScroll = '1800px'
    }
    // BAM101
    if (code === JCICCode.BAM101) {
      dataList = [
        { name: '資料年度', bodyKey: 'DATA_YYY', width: '90px', nzLeft: true },
        { name: '資料月份', bodyKey: 'DATA_MM', width: '90px' },
        { name: '短期放款金額(千元)', bodyKey: 'WECDU_AMT', width: '150px' },
        { name: '中期放款金額(千元)', bodyKey: 'HIGZ_AMT', width: '150px' },
        { name: '擔保放款金額(千元)', bodyKey: 'MNSTRK_AMT', width: '150px' },
        { name: '應收信用狀金額(千元)', bodyKey: 'J_AMT', width: '170px' },
        { name: '押匯承兌金額(千元)', bodyKey: 'PQX_AMT', width: '150px' },
        { name: '本票保證金額(千元)', bodyKey: 'F_AMT', width: '150px' },
        { name: '保證款項金額(千元)', bodyKey: 'L_AMT', width: '150px' },
        { name: '不含逾催呆總餘額(千元)', bodyKey: 'NORMAL_LOAN_AMT', width: '170px' },
        { name: '逾期金額(千元)', bodyKey: 'PASS_DUE_AMT', width: '120px' },
        { name: '催收金額(千元)', bodyKey: 'COLLECTION_AMT', width: '120px' },
        { name: '呆帳金額(千元)', bodyKey: 'BAD_DEBT', width: '120px', nzRight: true },
      ];
      title = 'BAM101 授信餘額變動資料(多筆B05-B06)',
        nzScroll = '1500px'
    }
    // BAM305
    if (code === JCICCode.BAM305) {
      dataList = [
        { name: '資料年度', bodyKey: 'DATA_YYY', width: '90px', nzLeft: true },
        { name: '資料月份', bodyKey: 'DATA_MM', width: '90px' },
        { name: '行庫代號', bodyKey: 'BANK_CODE', width: '90px' },
        { name: '行庫名稱', bodyKey: 'BANK_NAME', width: '90px' },
        { name: '科目別', bodyKey: 'ACCOUNT_CODE', width: '90px' },
        { name: '科目別註記', bodyKey: 'ACCOUNT_CODE2', width: '90px' },
        { name: '用途別', bodyKey: 'PURPOSE_CODE', width: '90px' },
        { name: '身分代號', bodyKey: 'GID_CODE', width: '90px' },
        { name: '主債務人身分證號', bodyKey: 'M_ID', width: '150px' },
        { name: '主債務人名稱', bodyKey: 'M_ID_NAME', width: '150px' },
        { name: '關係代號', bodyKey: 'RAPPL_CODE', width: '90px' },
        { name: '訂約金額(千元)', bodyKey: 'CONTRACT_AMT', width: '150px' },
        { name: '放款未逾期(千元)', bodyKey: 'LOAN_AMT', width: '200px' },
        { name: '逾期未還金額(千元)', bodyKey: 'PASS_DUE_AMT', width: '200px' },
        { name: '債權證券化資料年', bodyKey: 'ASST_DATA_YYY', width: '200px' },
        { name: '債權證券化資料月', bodyKey: 'ASST_DATA_MM', width: '200px' },
        { name: '債權證券化受託機構統一編號', bodyKey: 'ASST_IDN_BAN', width: '200px' },
        { name: '債權證券化受託機構名稱', bodyKey: 'ASST_NAME', width: '200px', nzRight: true },
      ];
      title = 'BAM305 99年版授信保證資料(共同債務)(多筆B33-B36)',
        nzScroll = '1500px'
    }
    // BAM306
    if (code === JCICCode.BAM306) {
      dataList = [
        { name: '資料年度', bodyKey: 'DATA_YYY', width: '90px', nzLeft: true },
        { name: '資料月份', bodyKey: 'DATA_MM', width: '90px' },
        { name: '行庫代號', bodyKey: 'BANK_CODE', width: '90px' },
        { name: '行庫名稱', bodyKey: 'BANK_NAME', width: '90px' },
        { name: '科目別', bodyKey: 'ACCOUNT_CODE', width: '90px' },
        { name: '科目別註記', bodyKey: 'ACCOUNT_CODE2', width: '90px' },
        { name: '用途別', bodyKey: 'PURPOSE_CODE', width: '90px' },
        { name: '身分代號', bodyKey: 'GID_CODE', width: '90px' },
        { name: '主債務人身分證號', bodyKey: 'M_ID', width: '150px' },
        { name: '主債務人名稱', bodyKey: 'M_ID_NAME', width: '150px' },
        { name: '關係代號', bodyKey: 'RAPPL_CODE', width: '90px' },
        { name: '訂約金額(千元)', bodyKey: 'CONTRACT_AMT', width: '150px' },
        { name: '放款未逾期(千元)', bodyKey: 'LOAN_AMT', width: '200px' },
        { name: '逾期未還金額(千元)', bodyKey: 'PASS_DUE_AMT', width: '200px' },
        { name: '債權證券化資料年', bodyKey: 'ASST_DATA_YYY', width: '200px' },
        { name: '債權證券化資料月', bodyKey: 'ASST_DATA_MM', width: '200px' },
        { name: '債權證券化受託機構統一編號', bodyKey: 'ASST_IDN_BAN', width: '200px' },
        { name: '債權證券化受託機構名稱', bodyKey: 'ASST_NAME', width: '200px', nzRight: true },
      ];
      title = 'BAM306 90年版授信保證資料(從債務)(多筆B33-B36)',
        nzScroll = '1500px'
    }
    // BAM307
    if (code === JCICCode.BAM307) {
      dataList = [
        { name: '資料年度', bodyKey: 'DATA_YYY', width: '90px', nzLeft: true },
        { name: '資料月份', bodyKey: 'DATA_MM', width: '90px' },
        { name: '行庫代號', bodyKey: 'BANK_CODE', width: '90px' },
        { name: '行庫名稱', bodyKey: 'BANK_NAME', width: '90px' },
        { name: '科目別', bodyKey: 'ACCOUNT_CODE', width: '90px' },
        { name: '科目別註記', bodyKey: 'ACCOUNT_CODE2', width: '90px' },
        { name: '用途別', bodyKey: 'PURPOSE_CODE', width: '90px' },
        { name: '身分代號', bodyKey: 'GID_CODE', width: '90px' },
        { name: '主債務人身分證號', bodyKey: 'M_ID', width: '150px' },
        { name: '主債務人名稱', bodyKey: 'M_ID_NAME', width: '150px' },
        { name: '關係代號', bodyKey: 'RAPPL_CODE', width: '90px' },
        { name: '訂約金額(千元)', bodyKey: 'CONTRACT_AMT', width: '150px' },
        { name: '放款未逾期(千元)', bodyKey: 'LOAN_AMT', width: '200px' },
        { name: '逾期未還金額(千元)', bodyKey: 'PASS_DUE_AMT', width: '200px' },
        { name: '債權證券化資料年', bodyKey: 'ASST_DATA_YYY', width: '200px' },
        { name: '債權證券化資料月', bodyKey: 'ASST_DATA_MM', width: '200px' },
        { name: '債權證券化受託機構統一編號', bodyKey: 'ASST_IDN_BAN', width: '200px' },
        { name: '債權證券化受託機構名稱', bodyKey: 'ASST_NAME', width: '200px', nzRight: true },
      ];
      title = 'BAM307 90年版授信保證資料(其他)(多筆B33-B36)',
        nzScroll = '1500px'
    }
    // BAM067
    if (code === JCICCode.BAM067) {
      dataList = [
        { name: '銀行代碼', bodyKey: 'BANK_CODE' },
        { name: '銀行名稱', bodyKey: 'BANK_NAME' },
        { name: '發卡日期', bodyKey: 'START_DATE' },
      ];
      title = 'BAM067 現金卡日報發卡日期資訊(多筆B66)'
    }
    // BAM070
    if (code === JCICCode.BAM070) {
      dataList = [
        { name: '資料日期', bodyKey: 'DATA_DATE' },
        { name: '銀行代碼', bodyKey: 'BANK_CODE' },
        { name: '銀行名稱', bodyKey: 'BANK_NAME' },
        { name: '科目別', bodyKey: 'ACCOUNT_CODE' },
        { name: '科目名稱', bodyKey: 'ACCOUNT_NAME' },
        { name: '科目別註記', bodyKey: 'ACCOUNT_CODE2' },
        { name: '科目別註記名稱', bodyKey: 'ACCOUNT_NAME2' },
        { name: '可動用額度(千元)', bodyKey: 'CONTRACT_AMT' },
        { name: '授信未逾期餘額(千元)', bodyKey: 'LOAN_AMT' },
        { name: '逾期餘額(千元)', bodyKey: 'PASS_DUE_AMT' },
        { name: '當日還款紀錄', bodyKey: 'PAY_CODE' },
        { name: '還款紀錄說明', bodyKey: 'PAY_NAME' },
        { name: '授信餘額列報1(千元)之原始金額(元)', bodyKey: 'AC_AMT' },
      ];
      title = 'BAM070 現金卡日報放款餘額及還款紀錄資訊(新版)(多筆B66)'
    }
    // KRM046
    if (code === JCICCode.KRM046) {
      dataList = [
        { name: '受查戶', bodyKey: 'IDN_BAN', width: '90px', nzLeft: true },
        { name: '類別', bodyKey: 'DISP_GROUP', width: '90px' },
        { name: '發卡機構代號', bodyKey: 'ISSUE', width: '150px' },
        { name: '發卡機構名稱', bodyKey: 'ISSUE_NAME', width: '150px' },
        { name: '卡名代號', bodyKey: 'CARD_BRAND', width: '90px' },
        { name: '標章代號', bodyKey: 'CARD_TYPE', width: '90px' },
        { name: '發卡日期', bodyKey: 'START_DATE', width: '90px' },
        { name: '額度（千元）', bodyKey: 'LIMIT', width: '120px' },
        { name: '是否綜合額度', bodyKey: 'YN_SHARE_LIMIT', width: '150px' },
        { name: '是否實體卡', bodyKey: 'YN_PHYSICAL', width: '130px' },
        { name: '開卡註記', bodyKey: 'ACT_MARK', width: '90px' },
        { name: '停用日期', bodyKey: 'STOP_DATE', width: '90px' },
        { name: '停用種類代號', bodyKey: 'STOP_CODE', width: '150px' },
        { name: '停用原因代號', bodyKey: 'AB_CODE', width: '150px' },
        { name: '結案代碼', bodyKey: 'CLOSE_CODE', width: '90px' },
        { name: '帳單別', bodyKey: 'BILL_MARK', width: '90px' },
        { name: '正卡人/繳款人受查戶', bodyKey: 'M_IDN_BAN', width: '200px' },
        { name: '正卡人/繳款人戶名', bodyKey: 'M_CNAME', width: '200px' },
        { name: '受查戶與正卡人/繳款人關係代號', bodyKey: 'RELA', width: '300px' },
        { name: '受查戶與正卡人/繳款人關係名稱', bodyKey: 'RELA_NAME', width: '300px' },
        { name: '風險損失金額（千元）', bodyKey: 'RISK', width: '200px' },
        { name: '欠款結清日期', bodyKey: 'CLEAR_DATE', width: '150px' },
        { name: '保證人受查戶', bodyKey: 'GUAR_ID', width: '150px' },
        { name: '保證人中文戶名', bodyKey: 'GUAR_CNAME', width: '150px' },
        { name: '欠款結清日期來自資產管理公司函告', bodyKey: 'YN_AMC_CLEAR', width: '300px' },
        { name: '註記', bodyKey: 'REMARK', width: '90px' },
        { name: '雙幣卡外幣別', bodyKey: 'FCUR_CODE', width: '150px', nzRight: true },
      ];
      title = 'KRM046 信用卡正附卡資訊(本人信用卡)(含雙幣卡)(多筆K21)',
        nzScroll = '1500px'
    }
    // KRM048
    if (code === JCICCode.KRM048) {
      dataList = [
        { name: '週/月報別', bodyKey: 'M_W', width: '90px', nzLeft: true },
        { name: '週報已更新(*)註記', bodyKey: 'RENEWED', width: '200px' },
        { name: '繳款人ID', bodyKey: 'IDN_BAN', width: '90px' },
        { name: '結帳日或資料基準日', bodyKey: 'BILL_DATE', width: '200px' },
        { name: '發卡機構代號', bodyKey: 'ISSUE', width: '150px' },
        { name: '發卡機構名稱', bodyKey: 'ISSUE_NAME', width: '150px' },
        { name: '帳單別', bodyKey: 'BILL_MARK', width: '90px' },
        { name: '信用卡別', bodyKey: 'CARD_TYPE', width: '90px' },
        { name: '永久額度(千元)', bodyKey: 'PERM_LIMIT', width: '150px' },
        { name: '臨時額度(千元)', bodyKey: 'TEMP_LIMIT', width: '150px' },
        { name: '預借現金額度(千元)', bodyKey: 'CASH_LIMIT', width: '180px' },
        { name: '本期應付帳款(元)', bodyKey: 'PAYABLE', width: '180px' },
        { name: '本期預借現金(元)', bodyKey: 'CASH_LENT', width: '180px' },
        { name: '上期應付帳款(元)', bodyKey: 'LAST_PAYA', width: '180px' },
        { name: '上期循環信用(元)', bodyKey: 'REVOL_BAL', width: '180px' },
        { name: '上期繳款狀況代號(金額)', bodyKey: 'PAY_STAT', width: '200px' },
        { name: '上期繳款狀況代號(時間)', bodyKey: 'PAY_CODE', width: '200px' },
        { name: '上期循環比率', bodyKey: 'REVOL_RATE', width: '150px' },
        { name: '未到期分期償還待付金額', bodyKey: 'PRE_OWED', width: '200px' },
        { name: '債權狀態註記', bodyKey: 'DEBT_CODE', width: '150px' },
        { name: '債權結案註記', bodyKey: 'CLOSE_CODE', width: '150px' },
        { name: '不良債權結案日期', bodyKey: 'CLEAR_DATE', width: '180px' },
        { name: '消費分期', bodyKey: 'PRE_SPENT', width: '90px' },
        { name: '預借現金分期', bodyKey: 'PRE_CASHED', width: '150px' },
        { name: '帳單分期', bodyKey: 'PRE_BILLED', width: '90px' },
        { name: '雙幣卡外幣別', bodyKey: 'FCUR_CODE', width: '150px', nzRight: true },
      ];
      title = 'KRM048 信用卡戶帳款資訊(週報+12個月)(含雙幣卡)(多筆K34)',
        nzScroll = '1500px'
    }
    // KCM012
    // if (code === JCICCode.KCM012) {
    //   dataList = [
    //     { name: '報送機構代號', bodyKey: 'BANK' },
    //     { name: '報送機構名稱', bodyKey: 'BANK_NAME' },
    //     { name: '資料類別(B:授信,K:信用卡)', bodyKey: 'TYPE' },
    //     { name: '是否已報送為非學生身分(Y/N)', bodyKey: 'YN' },
    //     { name: '學生身分起始報送年月', bodyKey: 'YYYMM1' },
    //     { name: '非學生身分起始報送年月', bodyKey: 'YYYMM2' },
    //   ];
    //   title = 'KCM012 學生身分報送紀錄(多筆，取代KCM011)'
    // }
    // DAM001
    // if (code === JCICCode.DAM001) {
    //   dataList = [
    //     { name: '主體退票未清償註記總金額 (千元)', bodyKey: 'BOUNCE_AMT' },
    //     { name: '主體退票未清償註記總張數', bodyKey: 'BOUNCE_CNT' },
    //     { name: '主體最近一次退票日期', bodyKey: 'LATEST_BOUNCE' },
    //     { name: '主體退票已清償註記總金額 (千元)', bodyKey: 'WRITEOFF_AMT' },
    //     { name: '主體退票已清償註記票總張數', bodyKey: 'WRITEOFF_CNT' },
    //     { name: '主體最近一次已清償註記註銷日期', bodyKey: 'LATEST_WRITEOFF' },
    //     { name: '連帶退票未清償註記總金額 (千元)', bodyKey: 'IDN_BOUNCE_AMT' },
    //     { name: '連帶退票未清償註記總張數', bodyKey: 'IDN_BOUNCE_CNT' },
    //     { name: '連帶最近一次退票日期', bodyKey: 'IDN_LATEST_BOUNCE' },
    //     { name: '連帶退票已清償註記總金額', bodyKey: 'IDN_WRITEOFF_AMT' },
    //     { name: '連帶退票已清償註記票總張數', bodyKey: 'IDN_WRITEOFF_CNT' },
    //     { name: '連帶最近一次已清償註記註銷日期', bodyKey: 'IDN_LATEST_WRITEOFF' },
    //   ];
    //   title = 'DAM001 主體連帶退票摘要紀錄(含外幣資訊)(多筆摘要)'
    // }
    // VAM020
    // if (code === JCICCode.VAM020) {
    //   dataList = [
    //     { name: '原身分證號', bodyKey: 'OLD_IDN' },
    //     { name: '新身分證號', bodyKey: 'NEW_IDN' },
    //     { name: '中文姓名', bodyKey: 'NAME' },
    //     { name: '本中心處理四期', bodyKey: 'OP_DATE' },
    //     { name: '比對代號(1:原身分證號 2:新身分證號)', bodyKey: 'TYPE' },
    //   ];
    //   title = 'VAM020 身分證號更改紀錄(表頭)'
    // }
    // VAM201
    // if (code === JCICCode.VAM201) {
    //   dataList = [
    //     { name: '通報種類', bodyKey: 'TYPE' },
    //     { name: '通報單位', bodyKey: 'CRI_PLACE' },
    //     { name: '發生日期', bodyKey: 'CRI_DATE' },
    //     { name: '通報日期', bodyKey: 'DOC_DATE' },
    //     { name: '中文戶名', bodyKey: 'CNAME' },
    //     { name: '單據號碼/人頭帳號', bodyKey: 'INVOICE_NO' },
    //     { name: '說明1', bodyKey: 'REMARK_1' },
    //     { name: '說明2', bodyKey: 'REMARK_2' },
    //     { name: '說明3', bodyKey: 'REMARK_3' },
    //     { name: '說明4', bodyKey: 'REMARK_4' },
    //     { name: '通報單位中文名稱', bodyKey: 'DOC_NAME' },
    //     { name: '警示帳戶解除代碼', bodyKey: 'REL_CODE' },
    //     { name: '警示帳戶解除原因', bodyKey: 'REL_REASON' },
    //     { name: '警示帳戶解除日期', bodyKey: 'REL_DATE' },
    //   ];
    //   title = 'VAM201 通報案件紀錄資訊-案件通報(多筆Z07)'
    // }

    // VAM106
    if (code === JCICCode.VAM106) {
      dataList = [
        { name: '統編/身分證號', bodyKey: 'IDN_BAN' },
        { name: '訊息登錄日期', bodyKey: 'DATA_DATE' },
        { name: '訊息種類大項代碼', bodyKey: 'MAINCODE' },
        { name: '訊息種類大項', bodyKey: 'MAINNOTE' },
        { name: '訊息種類細項代碼(新)', bodyKey: 'NEW_SUBCODE' },
        { name: '訊息種類細項', bodyKey: 'SUBNOTE' },
        { name: '訊息內容', bodyKey: 'NOTE' },
      ];
      title = 'VAM106 消債條例信用註記資訊(含個別協商)(多筆Z13，MAINCODE A(前協)、B(更生)、C(清算)、E(調解))、8(個別協商)'
    }
    // VAM107
    if (code === JCICCode.VAM107) {
      dataList = [
        { name: '統編/身分證號', bodyKey: 'IDN_BAN' },
        { name: '訊息登錄日期', bodyKey: 'DATA_DATE' },
        { name: '訊息種類大項代碼', bodyKey: 'MAINCODE' },
        { name: '訊息種類大項', bodyKey: 'MAINNOTE' },
        { name: '訊息種類細項代碼(新)', bodyKey: 'NEW_SUBCODE' },
        { name: '訊息種類細項', bodyKey: 'SUBNOTE' },
        { name: '訊息內容', bodyKey: 'NOTE' },
      ];
      title = 'VAM107 銀行公會消金案件債務協商補充註記(多筆Z13，MAINCODE7)'
    }
    // VAM108
    if (code === JCICCode.VAM108) {
      dataList = [
        { name: '統編/身分證號', bodyKey: 'IDN_BAN' },
        { name: '訊息登錄日期', bodyKey: 'DATA_DATE' },
        { name: '訊息種類大項代碼', bodyKey: 'MAINCODE' },
        { name: '訊息種類大項', bodyKey: 'MAINNOTE' },
        { name: '訊息種類細項代碼(新)', bodyKey: 'NEW_SUBCODE' },
        { name: '訊息種類細項', bodyKey: 'SUBNOTE' },
        { name: '訊息內容', bodyKey: 'NOTE' },
      ];
      title = 'VAM108 其它補充註記資訊(多筆Z13，非屬消債條例及銀行公會債務協商之註記資訊)'
    }
    // BAM608
    // if (code === JCICCode.BAM608) {
    //   dataList = [
    //     { name: '債權轉讓年度', bodyKey: 'DATA_YYY', width: '150px', nzLeft: true },
    //     { name: '債權轉讓月份', bodyKey: 'DATA_MM', width: '150px' },
    //     { name: '行庫代號', bodyKey: 'BANK_CODE', width: '90px' },
    //     { name: '行庫名稱', bodyKey: 'BANK_NAME', width: '90px' },
    //     { name: '新債權人ID', bodyKey: 'FOLL_IDN_BAN', width: '150px' },
    //     { name: '新債權人中文戶名', bodyKey: 'FOLL_CNAME', width: '150px' },
    //     { name: '債權處理案號', bodyKey: 'FOLL_NO', width: '150px' },
    //     { name: '科目別', bodyKey: 'ACCOUNT_CODE', width: '90px' },
    //     { name: '科目別註記', bodyKey: 'ACCOUNT_CODE2', width: '150px' },
    //     { name: '用途別', bodyKey: 'PURPOSE_CODE', width: '90px' },
    //     { name: '綜合額度金額(千元)', bodyKey: 'CONTRACT_AMT', width: '150px' },
    //     { name: '放款未逾期(千元)', bodyKey: 'LOAN_AMT', width: '150px' },
    //     { name: '逾期未還金額(千元)', bodyKey: 'PASS_DUE_AMT', width: '150px', nzRight: true },
    //   ];
    //   title = 'BAM608 債權轉讓資料明細-B33(多筆B33，資料年月自9405開始)',
    //     nzScroll = '1500px'
    // }
    return { dataList, title, nzScroll }
  }
}
