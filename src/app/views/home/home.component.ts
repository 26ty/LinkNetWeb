import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { HttpApiService } from 'src/app/api/http-api.service';
import { DateService } from 'src/app/shared/date/date.service';
import { Router } from '@angular/router';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2'

const USER_KEY = 'auth-user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('paginator') paginator!: MatPaginator;
  constructor(
    private router: Router,
    private HttpApiService: HttpApiService,
    private DateService: DateService,
    private matPaginatorIntl: MatPaginatorIntl,
  ) { }

  // MatPaginator Inputs
  totalCount!: number;
  // MatPaginator Output
  pageEvent!: PageEvent;

  userData: any = ""
  today: any
  ngOnInit(): void {
    const userLocalData = window.localStorage.getItem(USER_KEY)
    this.userData = JSON.parse(String(userLocalData))

    // 呼叫取得所有文章
    this.getAllArticle()

    // 取得隨機指定數量文章
    this.getRandomArticle(3)


    const p: any = document.getElementById('article-content')
    // this.limitText(p,20)

    this.today = this.DateService.getToday()

    this.setPaginator();

    //現在位址
    this.getNowLocation();

    //預測天氣
    this.getForcastWeatherData("臺南市", "Wx");

    //現在天氣
    this.getNowWeatherData("臺南", "TEMP");
  }

  nowLocationData:any
  city:any
  /**
    * 取得現在位置 經緯度轉址
    * @return {obj} location datas 
  */
  getNowLocation() {
    // 
    this.HttpApiService.getLocation().subscribe(
      res => {
        console.log(res)
        this.nowLocationData = res
        this.city = this.nowLocationData.address.city
      },
      err => {
        console.log("存取錯誤!", err)
        console.log("API狀態碼:", err.status);
      }
    )
  }
  //預測天氣觀測報告
  forcastWeatherData: any;
  dispalyForcastWeatherData: any;
  nowWeatherDiscription:any
  /**
    * 取得一般天氣預報－今明36小時天氣預報 https://opendata.cwb.gov.tw/dist/opendata-swagger.html
    * @param elementName 欲取得資訊 天氣因子 ex:Wx
    * @param locationName 填入臺灣各縣市 ex:臺南市
    * @return {obj} weather datas 
  */
  getForcastWeatherData(locationName: string, elementName: string) {
    this.HttpApiService.getForcastWeather(locationName, elementName).subscribe(
      res => {
        this.forcastWeatherData = res.records.location;
        console.log("預測天氣", this.forcastWeatherData)
        this.dispalyForcastWeatherData = this.forcastWeatherData[0].weatherElement[0].time[0].parameter
        console.log("[顯示]預測天氣－敘述", this.dispalyForcastWeatherData)
        this.nowWeatherDiscription = this.dispalyForcastWeatherData.parameterName
      },
      err => {
        console.log("存取錯誤!", err)
        console.log("API狀態碼:", err.status);
        Swal.fire({
          icon: 'error',
          title: "存取錯誤！",
          showConfirmButton: false,
          timer: 1500
        })
      }
    )
  }

  //現在天氣觀測報告
  nowWeatherData: any;
  displayNowWeatherData: any;
  nowTemp:any
  /**
    * 取得現在天氣觀測報告 https://opendata.cwb.gov.tw/dist/opendata-swagger.html
    * @param elementName 欲取得資訊 ex:TEMP
    * @param locationName 填入氣象站 ex:臺南 可參考 https://e-service.cwb.gov.tw/wdps/obs/state.htm
    * @return {obj} weather datas 
  */
  getNowWeatherData(locationName: string, elementName: string) {
    this.HttpApiService.getNowWeather(locationName, elementName).subscribe(
      res => {
        this.nowWeatherData = res.records.location;
        console.log("現在天氣", this.nowWeatherData)
        this.displayNowWeatherData = this.nowWeatherData[0].weatherElement[0]
        console.log("[顯示]現在天氣-溫度", this.displayNowWeatherData)
        this.nowTemp = this.displayNowWeatherData.elementValue
      },
      err => {
        console.log("存取錯誤!", err)
        console.log("API狀態碼:", err.status);
        Swal.fire({
          icon: 'error',
          title: "存取錯誤！",
          showConfirmButton: false,
          timer: 1500
        })
      }
    )
  }

  //所有文章資料
  articleDatas: any;
  /**
    * 取得所有文章data
    *
    * @return {obj} article datas 
  */
  getAllArticle() {
    this.HttpApiService.getArticleRequest().subscribe(
      res => {
        this.articleDatas = res
        console.log("取得所有文章res", this.articleDatas)

        for (let i in this.articleDatas) {
          if (this.articleDatas[i].img_url != null) {
            //取得圖片資訊
            this.getArticleImageFile(this.articleDatas[i].id, this.articleDatas[i].img_url)
          }
        }
      },
      err => {
        console.log("存取錯誤!", err)
        console.log("API狀態碼:", err.status);
      }
    )
  }

  //所有文章資料
  randomArticleDatas: any;
  /**
    * 取得隨機指定文章data
    * @param  {string} count
    * @return {obj} article datas 
  */
  getRandomArticle(count?: number) {
    this.HttpApiService.getRandomArticlesRequest(count).subscribe(
      res => {
        this.randomArticleDatas = res
        console.log("取得隨機指定文章res", this.randomArticleDatas)

        for (let i in this.randomArticleDatas) {
          if (this.randomArticleDatas[i].img_url != null) {
            //取得圖片資訊
            this.getArticleImageFile(this.randomArticleDatas[i].id, this.randomArticleDatas[i].img_url)

            var substr = this.randomArticleDatas[i].content.substr(0, 23);
            this.randomArticleDatas[i].content = substr;
            console.log("截斷文章內容", this.randomArticleDatas[i].content)
          }
        }


      },
      err => {
        console.log("存取錯誤!", err)
        console.log("API狀態碼:", err.status);
      }


    )
  }

  //取blob:後的URL
  imageUrl: any
  //轉換過的url及其對應id陣列
  articleImageDataList: any[] = [];
  //交換完圖片網址的所有文章資料
  newArticleDatas: any
  /**
    * 取得圖片
    * @param  {string} a_id 填入文章id
    * @param  {string} imageName 填入欲取得圖片名稱
    * @return {obj} imagePath and other datas 
  */
  getArticleImageFile(a_id: string, imageName: string) {
    this.HttpApiService.getArticleImageFileRequest(imageName).subscribe(
      res => {
        // console.log("取得圖片res",res);
        // 設置 blob 的類型為圖像的 MIME 類型
        const blob = new Blob([res], { type: 'image/jpeg' });
        // 使用 blob 創建圖像 URL
        this.imageUrl = URL.createObjectURL(blob);
        // console.log("取blob:後的URL",this.imageUrl)

        // 設置[轉換過的url及其對應id陣列]
        this.articleImageDataList.push({ "id": a_id, "img_url": this.imageUrl }) //轉換過的url及其對應id陣列
        // console.log("轉換過的url及其對應id陣列",this.articleImageDataList)

        this.newArticleDatas = this.articleDatas.concat();
        for (let i in this.newArticleDatas) {
          for (let j in this.articleImageDataList) {
            if (this.newArticleDatas[i].id == this.articleImageDataList[j].id) {
              this.newArticleDatas[i].img_url = this.articleImageDataList[j].img_url;
            }
          }
        }

        // console.log("交換完圖片網址的所有文章資料",this.newArticleDatas)
      },
      err => {
        console.log("存取錯誤!", err)
        console.log("API狀態碼:", err.status);
      }
    )
  }

  /**
   * 提取字符串中第一个":"后面的值
   * @param {string} str 欲切割的字串 
   * @returns {string} str 第一個“:”後的字串值
   */
  extractValue(str: string): string {
    const index = str.indexOf(':');
    if (index !== -1) {
      return str.slice(index + 1).trim();
    } else {
      return '';
    }
  }


  /**
    * 刪除文章
    * @param  {string} id 填入文章id
  */
  deleteArticle(id: string) {
    Swal.fire({
      title: "是否確定刪除文章",
      //text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#1972D6',
      cancelButtonText: '取消',
      confirmButtonText: '刪除',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.HttpApiService.deleteArticleRequest(id).subscribe(
          res => {
            console.log("deleteArticle", res)
            if (res.statusCode == 200) {
              Swal.fire({
                icon: 'success',
                title: "已成功刪除！",
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                // 重新載入页面
                this.getAllArticle()
              })

            } else {
              Swal.fire({
                icon: 'error',
                title: "刪除失敗！",
                showConfirmButton: false,
                timer: 1500
              })
            }
          },
          err => {
            console.log("存取錯誤!", err)
            console.log("API狀態碼:", err.status);
            Swal.fire({
              icon: 'error',
              title: "刪除失敗！",
              showConfirmButton: false,
              timer: 1500
            })
          }
        )
      }
    })

  }

  // p = document.getElementById('article-content');
  /**
    * 限制<p>內字數顯示
    * @param limit 限制字數
    * @return {obj} article datas 
  */
  limitText(p: HTMLElement, limit: number): void {
    const text: any = p.textContent?.trim();
    if (text.length > limit) {
      const truncated: string = text.slice(0, limit) + '...';
      p.textContent = truncated;
    }
  }

  // 設定分頁器參數--------------------------------------------------------
  setPaginator() {
    // 設定顯示筆數資訊文字
    this.matPaginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number): string => {
      if (length === 0 || pageSize === 0) {
        return `第 0 筆、共 ${length} 筆`;
      }

      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

      return `第 ${startIndex + 1} - ${endIndex} 筆、共 ${length} 筆`;
    };

    // 設定其他顯示資訊文字
    this.matPaginatorIntl.itemsPerPageLabel = '每頁筆數：';
    this.matPaginatorIntl.nextPageLabel = '下一頁';
    this.matPaginatorIntl.previousPageLabel = '上一頁';
  }


  /**
    * 前往文章細節頁面
  */
  detailArticle(id: string) {
    window.location.assign('/detailArticle/' + id);
  }

  /**
    * 前往新增文章頁面
  */
  addArticleLink() {
    window.location.assign('/addArticle');
  }

  /**
    * 前往文章編輯頁面
  */
  editArticle(id: string) {
    window.location.assign('/editArticle/' + id);
  }
}
