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

    @Autowired
    private TransportClient client;

    @RequestMapping(value = "/middlePageQry",method = RequestMethod.POST)
    public void middlePageQry(HttpServletResponse response) throws IOException, ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");
        SearchResponse searchResponse = client.prepareSearch("blog")
                .setSize(3)
                .get();
        SearchHits hits = searchResponse.getHits();
        JSONArray result = new JSONArray();
        for (SearchHit hit:hits){
            JSONObject dataJson = JSONObject.fromObject(hit.getSourceAsString());
            String param = (String) dataJson.get("createtime");
            param = param.replace("Z"," UTC");
            Date dateTran = simpleDateFormat.parse(param);
            String createtime = sdf.format(dateTran);
            dataJson.put("createtime",createtime);
            result.add(dataJson);
        }
        response.setCharacterEncoding("utf-8");
        response.setContentType("application/json; charset=utf-8");
        logger.info("AJAX返回数据信息");
        response.getWriter().write(com.alibaba.fastjson.JSONObject.toJSONString(result));
    }
}
