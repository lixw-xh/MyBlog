package com.blog.lxw.controller;


import com.blog.lxw.entity.es.EsBlog;
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
import java.util.Date;
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

    //日期格式处理
    private final static SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private final static SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");

    @Autowired
    private TransportClient client;

    @RequestMapping(value = "/middlePageQry",method = RequestMethod.POST)
    public void middlePageQry(HttpServletResponse response) throws IOException, ParseException {
        SearchResponse searchResponse = client.prepareSearch(INDEX)
                .setSize(3)
                .get();
        doHandle(response, sdf, simpleDateFormat, searchResponse);
    }

    @RequestMapping(value = "downPageQry", method = RequestMethod.POST)
    public void downPageQry(HttpServletResponse response) throws IOException, ParseException {
        Date date = new Date();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        String dateStr = format.format(date);
        SearchResponse searchResponse = client.prepareSearch(INDEX)
                .setQuery(QueryBuilders.termQuery("createtime", dateStr))
                .setSize(3)
                .get();
        doHandle(response, sdf, simpleDateFormat, searchResponse);
    }

    @RequestMapping(value = "/bottomPageQry", method = RequestMethod.POST)
    public void bottomPageQry(HttpServletResponse response) throws IOException, ParseException {
        SearchResponse searchResponse = client.prepareSearch(INDEX)
                .setQuery(QueryBuilders.matchAllQuery())
                .addSort("likes", SortOrder.DESC)
                .setSize(3)
                .get();
        doHandle(response, sdf, simpleDateFormat, searchResponse);
    }

    private void doHandle(HttpServletResponse response, SimpleDateFormat sdf, SimpleDateFormat simpleDateFormat, SearchResponse searchResponse) throws ParseException, IOException {
        SearchHits hits = searchResponse.getHits();
        JSONArray result = new JSONArray();
        for (SearchHit hit:hits){
            JSONObject jsonData = JSONObject.fromObject(hit.getSourceAsString());
            String param = (String) jsonData.get("createtime");
            param = param.replace("Z"," UTC");
            Date datePar = simpleDateFormat.parse(param);
            String createtime = sdf.format(datePar);
            jsonData.put("createtime",createtime);
            result.add(jsonData);
        }
        response.setCharacterEncoding("utf-8");
        response.setContentType("application/json; charset=utf-8");
        logger.info("AJAX返回数据信息");
        response.getWriter().write(com.alibaba.fastjson.JSONObject.toJSONString(result));
    }
}
