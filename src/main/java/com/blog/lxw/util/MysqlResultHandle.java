package com.blog.lxw.util;

import com.blog.lxw.entity.mysql.MysqlBlog;
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
import java.util.ArrayList;
import java.util.Date;

/**
 * @author Lixw
 * @date 2020/3/7
 * ES返回数据处理
 */
@Component
public class MysqlResultHandle {

    private final static Logger logger = LoggerFactory.getLogger(MysqlResultHandle.class);

    //日期格式处理
    private final static SimpleDateFormat SDF = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private final static SimpleDateFormat SIMPLE_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");

    public void doMysqlHandle(HttpServletResponse response, ArrayList<MysqlBlog> Datas) throws ParseException, IOException {
        JSONArray result = new JSONArray();
        logger.info("放入JSONArray中");
        //遍历集合
        for (MysqlBlog Data:Datas){
            //MysqlBlog实体转为json
            JSONObject jsonData = JSONObject.fromObject(Data);
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
