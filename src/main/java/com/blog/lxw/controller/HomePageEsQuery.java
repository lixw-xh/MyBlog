package com.blog.lxw.controller;


import com.blog.lxw.entity.es.EsBlog;
import com.blog.lxw.entity.mysql.MysqlBlog;
import com.blog.lxw.service.CompensationQryService;
import com.blog.lxw.util.MysqlResultHandle;
import com.blog.lxw.util.ResultHandle;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.xcontent.XContentBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.sort.SortOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * @author Lixw
 * @date 2020/2/28
 * 首页ES查询
 */
@RestController
@RequestMapping("blog")
public class HomePageEsQuery {
    private final static Logger logger = LoggerFactory.getLogger(HomePageEsQuery.class);

    //Es索引
    private final static String INDEX = "blog";

    @Autowired
    private TransportClient client;

    @Autowired
    private ResultHandle resultHandle;

    @Autowired
    private MysqlResultHandle mysqlResultHandle;

    @Autowired
    private CompensationQryService compensationQryService;

    //日期格式处理
    private final static SimpleDateFormat SDF = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private final static SimpleDateFormat SIMPLE_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");

    @RequestMapping(value = "/middlePageQry",method = RequestMethod.POST)
    public void middlePageQry(HttpServletResponse response) throws IOException, ParseException {
        SearchResponse searchResponse = client.prepareSearch(INDEX)
                .setSize(3)
                .get();
        if ("".equals(searchResponse) || null == searchResponse){
            logger.info("开始Mysql补偿查询");
            ArrayList<MysqlBlog> middleDatas = compensationQryService.middlePageQry();
            logger.info("Mysql数据格式处理");
            mysqlResultHandle.doMysqlHandle(response, middleDatas);
        }else{
            logger.info("Es数据格式处理");
            resultHandle.doHandle(response, searchResponse);
        }
    }

    @RequestMapping(value = "/downPageQry", method = RequestMethod.POST)
    public void downPageQry(HttpServletResponse response) throws IOException, ParseException {
        SearchResponse searchResponse = client.prepareSearch(INDEX)
                .setQuery(QueryBuilders.matchAllQuery())
                .addSort("createtime", SortOrder.DESC)
                .setSize(3)
                .get();
        if ("".equals(searchResponse) || null == searchResponse){
            logger.info("开始Mysql补偿查询");
            ArrayList<MysqlBlog> downDatas = compensationQryService.downPageQry();
            logger.info("Mysql数据格式处理");
            mysqlResultHandle.doMysqlHandle(response, downDatas);
        }else {
            logger.info("Es数据格式处理");
            resultHandle.doHandle(response, searchResponse);
        }
    }

    @RequestMapping(value = "/bottomPageQry", method = RequestMethod.POST)
    public void bottomPageQry(HttpServletResponse response) throws IOException, ParseException {
        SearchResponse searchResponse = client.prepareSearch(INDEX)
                .setQuery(QueryBuilders.matchAllQuery())
                .addSort("likes", SortOrder.DESC)
                .setSize(3)
                .get();
        if ("".equals(searchResponse) || null == searchResponse){
            logger.info("开始Mysql补偿查询");
            ArrayList<MysqlBlog> bottomDatas = compensationQryService.bottomPageQry();
            logger.info("Mysql数据格式处理");
            mysqlResultHandle.doMysqlHandle(response, bottomDatas);
        }else {
            logger.info("Es数据格式处理");
            resultHandle.doHandle(response, searchResponse);
        }
    }
}
