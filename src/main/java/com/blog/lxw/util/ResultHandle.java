package com.blog.lxw.util;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @author Lixw
 * @date 2020/3/7
 * ES返回数据处理
 */
@Component
public class ResultHandle {

    private final static Logger logger = LoggerFactory.getLogger(ResultHandle.class);

    //日期格式处理
    private final static SimpleDateFormat SDF = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private final static SimpleDateFormat SIMPLE_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");

    public void doHandle(HttpServletResponse response, SearchResponse searchResponse) throws ParseException, IOException {
        SearchHits hits = searchResponse.getHits();
        JSONArray result = new JSONArray();
        for (SearchHit hit:hits){
            JSONObject jsonData = JSONObject.fromObject(hit.getSourceAsString());
            String param = (String) jsonData.get("createtime");
            param = param.replace("Z"," UTC");
            Date datePar = SIMPLE_DATE_FORMAT.parse(param);
            String createtime = SDF.format(datePar);
            jsonData.put("createtime",createtime);
            result.add(jsonData);
        }
        response.setCharacterEncoding("utf-8");
        response.setContentType("application/json; charset=utf-8");
        logger.info("AJAX返回数据信息");
        response.getWriter().write(com.alibaba.fastjson.JSONObject.toJSONString(result));
    }
}
