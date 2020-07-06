package com.blog.lxw.controller;

import com.blog.lxw.entity.mysql.MysqlBlog;
import com.blog.lxw.service.CommunityService;
import com.blog.lxw.util.ResultHandle;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.sort.SortOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

/**
 * @author Lixw
 * @date 2020/3/7
 * 博客社区
 */
@RestController
@RequestMapping("blog")
public class CommunityController {
    private final static Logger logger = LoggerFactory.getLogger(CommunityController.class);

    @Autowired
    private TransportClient client;

    @Autowired
    private ResultHandle resultHandle;

    @Autowired
    private CommunityService communityService;

    //索引
    private final static String INDEX = "blog";

    //日期格式处理
    private final static SimpleDateFormat SDF = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private final static SimpleDateFormat SIMPLE_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");


    @RequestMapping(value = "/community", method = RequestMethod.GET)
    public ModelAndView communityView(){
        ModelAndView modelAndView = new ModelAndView("community");
        logger.info("登录社区");
        return modelAndView;
    }

    @RequestMapping(value = "/getBlogData",method = RequestMethod.POST)
    public void getBlogData(HttpServletResponse response) throws IOException, ParseException {
        SearchResponse searchResponse = client.prepareSearch(INDEX)
                .setSize(4)
                .addSort("id", SortOrder.ASC)
                .get();
        resultHandle.doHandle(response, searchResponse);
    }

    @RequestMapping(value = "/getMostWatch",method = RequestMethod.POST)
    public void getMostWatch(HttpServletResponse response) throws IOException, ParseException {
        SearchResponse searchResponse = client.prepareSearch(INDEX)
                .setQuery(QueryBuilders.matchAllQuery())
                .addSort("watch", SortOrder.DESC)
                .setSize(3)
                .get();
        resultHandle.doHandle(response, searchResponse);
    }

    @RequestMapping(value = "/getPageNumber", method = RequestMethod.POST)
    public void getPageNumber(HttpServletResponse response) throws IOException {
        MysqlBlog dataNumber = communityService.getPageNumber();
        int pageNumber = dataNumber.getDataNumber()/ 4;
        JSONArray result = new JSONArray();
        for (int i = 1; i <= pageNumber; i++){
            result.add(i);
        }
        response.setCharacterEncoding("utf-8");
        response.setContentType("application/json; charset=utf-8");
        logger.info("AJAX返回数据信息");
        response.getWriter().write(com.alibaba.fastjson.JSONObject.toJSONString(result));
    }

    @RequestMapping(value = "getBlogAccordPageNumber", method = RequestMethod.POST)
    public void getBlogAccordPageNumber(HttpServletRequest request, HttpServletResponse response) throws IOException, ParseException {
        //获取前台的页码
        String pageNum = request.getParameter("pageNum");
        //通过页码计算从第几个开始取值，固定每次取4条数据，因此计算方式为【（页码-1）*4】，如:传入第一页，公式=（1-1）*4，等于0，表示从第0个开始取值（数据库第0个也就是第一行数据）
        int row = (Integer.parseInt(pageNum) - 1)*4;
        //根据参数row进行取值
        ArrayList<MysqlBlog> blogDatas = communityService.getBlogAccordPageNumber(row);
        JSONArray result = new JSONArray();
        logger.info("放入JSONArray中");
        //遍历集合
        for (MysqlBlog blogData:blogDatas){
            //blogData实体转为json
            JSONObject jsonData = JSONObject.fromObject(blogData);
            //取出createtime字段信息，实体转为json后createtime字段为集合类型，不能直接使用，集合中有时间戳，因此采用时间戳定位时间值
            JSONObject timeData = JSONObject.fromObject(jsonData.get("createtime").toString());
            //取出createtime字段集合中time（时间戳）信息，进行时间格式处理
            String param = SDF.format(timeData.get("time"));
            //将处理的时间放回createtime字段中，重新赋值
            jsonData.put("createtime", param);
            //将json数据放入json数组中
            result.add(jsonData);
        }
        response.setCharacterEncoding("utf-8");
        response.setContentType("application/json; charset=utf-8");
        logger.info("AJAX返回数据信息");
        response.getWriter().write(com.alibaba.fastjson.JSONObject.toJSONString(result));
    }
}
