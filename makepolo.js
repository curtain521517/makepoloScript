// ==UserScript==
// @name         马可波罗自动发布信息脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       xufan
// @match        *.makepolo.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js, https://github.com/weplay/jquery-swfobject/blob/master/jquery.swfobject.js
// ==/UserScript==

//配置信息
var configObj = {
    username:"zzedi8",         //用户名
    password:"fa1234",         //密码
    timewait:500,              //等待间隔单位ms
    category:{
        category1:1,           //第一个类目的大分类，这里是设备类
        category11:2,          //设备类里面的分类，这里是行业专用设备
        category2:26,          //第二个类目的分类，这里是水利水资源专用机械
        category3:5,           //第三个类目的分类，这里是原水处理设备
        category4:4,           //第四个类目的分类，这里是反渗透设备
    },
    brand:2,                   //第二个选项《东丽》
    model:"xxxx",              //型号 xxx
    style:1,                   //反渗透膜类型
    custommade:1,              //加工定制，1表示不是，2表示定制
    wateryield:0.5,            //产水量
    effluentconductivity:0.5,  //出水电导率
    rateofdesalination: 0.5,   //脱盐率
    workingpressure: 0.5,      //工作压力
    workingtemperature: 0.5,   //工作温度
    power:0.6,                 //功率
    price:2000,                //售价
    keywords:"",               //关键字
};

var titles = new Array("标题1","标题2");

var timer;


function setCookie(c_name,value,expiredays)
{
    var exdate=new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie=c_name+ "=" +escape(value)+
        ((expiredays===null) ? "" : ";expires="+exdate.toGMTString());
}

function getCookie(c_name)
{
    if (document.cookie.length>0)
    {
        c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!=-1)
        {
            c_start=c_start + c_name.length+1;
            c_end=document.cookie.indexOf(";",c_start);
            if (c_end==-1)
                c_end=document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "0";
}



function checkLogin()
{
    var logOut = $("input#new_passwd.input_top").next().is(":hidden");
    return logOut;
}

function login(username,password)
{
    $("input#new_username.input_top").val(username);
    $("input#new_passwd.input_top").val(password);
}

function releaseInfo()
{
    var as=document.getElementsByTagName("a");
    for(var i in as){
        var title = as[i].getAttribute("title");
        if(title == "免费发布供应信息"){
            as[i].click();
            break;
        }
    }
}

function selectClass(cls,fir,sec)
{
    var box = document.getElementById("floatBox1");
    var category = box.children[cls-1];
    var categorys = category.children;
    var con;
    var li;
    if(cls==1)
    {
        con = categorys[fir].lastElementChild;
        con.setAttribute("style","display: block");
        li = con.children;
        li[sec-1].firstElementChild.click();
    }
    else
    {
        con = category.lastElementChild;
        li = con.children;
        if(li.length <=0 )
            return;
        li[fir-1].firstElementChild.click();
    }
}

function clickNext()
{
    var btn = document.getElementsByClassName("postProduct_nextstep")[0];
    btn.click();
}

function clickUploadPicture()
{
    //document.getElementById("SWFUpload_0").click();
    //$("#SWFUpload_0").flash();
    var oReq = new XMLHttpRequest();
    var path = "file:///Users/xufan/Desktop/test.json";
    oReq.open("GET", path, true);
    oReq.onreadystatechange = function ()
    {
        if (oReq.readyState == oReq.DONE)
        {
           alert(oReq.responseText);
        }
    };

    oReq.send();
}

$(document).ready(function(){
    var url = document.URL;
    // 刚进来的的时候页面
    $("<input type='button' value='开始' id='xf_start'> <input type='button' value='删除cookie' id='xf_del'>").prependTo("body");
    $("#xf_del").click(function(){
        setCookie("autoAction",0);
        alert("click del");
    });

    //首页面
    if(url == "http://china.makepolo.com/")
    {
        $("#xf_start").click(function(){
            //检测登陆情况
            if(!checkLogin())
            {
                setCookie("autoAction",1);
                login(configObj.username, configObj.password);
                form_submit2();
            }
            else
            {
                setCookie("autoAction",2);
                releaseInfo();
            }
        });
        if(getCookie("autoAction") == "1")
        {
            setCookie("autoAction",2);
            releaseInfo();
        }
    }
    //发布信息页面
    else if(url == "http://my.b2b.makepolo.com/ucenter/product/product_add_category.php")
    {
        var t = configObj.timewait;
        selectClass(1,configObj.category.category1,configObj.category.category11);
        var timer = setTimeout(function(){
            selectClass(2,configObj.category.category2,0);
            timer = setTimeout(function(){
                selectClass(3,configObj.category.category3,0);
                timer = setTimeout(function(){
                    selectClass(4,configObj.category.category4,0);
                    clearTimeout(timer);
                    clickNext();
                },t);
            },t);
        },t);
    }
    //发布供应产品页面
    else if(url.substring(0,url.indexOf("?")) == "http://my.b2b.makepolo.com/ucenter/product/product_process.php")
    {
        //<input type="radio" id="radio_148143_153549" name="148143[88107][one]" value="153549_olopekam_TS" class="postProduct_paramBox_con_box must_write_radio brand_needradio">
        //<input type="radio" id="radio_148143_152818" name="148143[88120][one]" value="152818_olopekam_醋酸纤维素" class="postProduct_paramBox_con_box no_must_write_radio ">
        //<input type="radio" id="radio_148143_152810" name="148143[88109][one]" value="152810_olopekam_是" class="postProduct_paramBox_con_box no_must_write_radio ">
        //标题点击
        $("#publish_title").click();
        $("#publish_title").val(titles[0]);
        //品牌
        $("input.postProduct_paramBox_con_box.must_write_radio.brand_needradio").eq(configObj.brand-1).attr("checked",true);
        $("#pro_category_attributes > dl:nth-child(2) > dd > input.postProduct_paramBox_con_inputtxt.model_need.must_write").val(configObj.model);
        $("input.postProduct_paramBox_con_box.no_must_write_radio").eq(configObj.style-1).attr("checked",true);
        $("input.postProduct_paramBox_con_box.no_must_write_radio").eq(4+configObj.custommade-1).attr("checked",true);
        
        $("#pro_category_attributes > dl:nth-child(5) > dd > input.postProduct_paramBox_con_inputtxt.no_must_write").val(configObj.wateryield);
        $("#pro_category_attributes > dl:nth-child(6) > dd > input.postProduct_paramBox_con_inputtxt.no_must_write").val(configObj.effluentconductivity);
        $("#pro_category_attributes > dl:nth-child(7) > dd > input.postProduct_paramBox_con_inputtxt.no_must_write").val(configObj.rateofdesalination);
        $("#pro_category_attributes > dl:nth-child(8) > dd > input.postProduct_paramBox_con_inputtxt.no_must_write").val(configObj.workingpressure);
        $("#pro_category_attributes > dl:nth-child(9) > dd > input.postProduct_paramBox_con_inputtxt.no_must_write").val(configObj.workingtemperature);
        $("#pro_category_attributes > dl:nth-child(10) > dd > input.postProduct_paramBox_con_inputtxt.no_must_write").val(configObj.power);
        $("#title").val(titles);
        $("#unit_price").val(configObj.price);
        
        document.getElementById("button_submit").click();
        
        clickUploadPicture();
        
        

    }
});


