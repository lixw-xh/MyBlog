package com.blog.lxw.controller;

import com.alibaba.fastjson.JSONObject;
import com.blog.lxw.entity.es.EsBlog;
import com.blog.lxw.entity.mysql.MysqlBlog;
import com.blog.lxw.service.CompensationQryService;
import com.blog.lxw.service.WatchAddService;
import com.blog.lxw.util.ResultHandle;

import net.sf.json.JSONArray;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.index.query.QueryBuilders;
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
import java.lang.reflect.InvocationTargetException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Map;

import static org.apache.commons.beanutils.BeanUtils.populate;

/**
 * @author Lixw
 * @date 2020/3/17
 * 博客信息
 */
@RestController
@RequestMapping("blog")
public class BlogInformationController {
    private final static Logger logger = LoggerFactory.getLogger(BlogInformationController.class);

    @Autowired
    private TransportClient client;

    @Autowired
    private ResultHandle resultHandle;

    @Autowired
    private WatchAddService watchAddService;

    @Autowired
    private CompensationQryService compensationQryService;

    //索引
    private final static String INDEX = "blog";
    //日期格式处理
    private final static SimpleDateFormat SDF = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private final static SimpleDateFormat SIMPLE_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");

    @RequestMapping(value = "/idQry", method = RequestMethod.GET)
    public ModelAndView idQry(EsBlog esBlog){
        ModelAndView modelAndView = new ModelAndView("article");
        int id = esBlog.getId();
        modelAndView.addObject("blogId", id);
        logger.info("跳转至具体博客页");
        watchAddService.watchNumAdd(id);
        logger.info("增加浏览数完成");
        return modelAndView;
    }

    @RequestMapping(value = "/accrodingToId",method = RequestMethod.POST)
    public void accrodingToId(HttpServletRequest request, HttpServletResponse response, EsBlog esBlog) throws IOException, ParseException, InvocationTargetException, IllegalAccessException {
        String blogId = request.getParameter("blogId");
        GetResponse searchResponse = client.prepareGet(INDEX,"_doc",blogId).get();
        if ("".equals(searchResponse) || null == searchResponse){
            logger.info("开始Mysql补偿查询");
            MysqlBlog accrodingToIdData = compensationQryService.accrodingToId(blogId);
            //MysqlBlog实体转为json
            net.sf.json.JSONObject result = net.sf.json.JSONObject.fromObject(accrodingToIdData);
            //取出createtime字段信息，实体转为json后createtime字段为集合类型，不能直接使用，集合中有时间戳，因此采用时间戳定位时间值
            net.sf.json.JSONObject timeData = net.sf.json.JSONObject.fromObject(result.get("createtime").toString());
            //取出createtime字段集合中time（时间戳）信息，进行时间格式处理
            String param = SDF.format(timeData.get("time"));
            //将处理的时间放回createtime字段中，重新赋值
            result.put("createtime", param);
            response.setCharacterEncoding("utf-8");
            response.setContentType("application/json; charset=utf-8");
            logger.info("AJAX返回数据信息");
            response.getWriter().write(com.alibaba.fastjson.JSONObject.toJSONString(result));
        }else{
            Map<String,Object> source = searchResponse.getSource();
            JSONObject result = new JSONObject(source);
            logger.info("处理日期格式");
            String param = (String) result.get("createtime");
            param = param.replace("Z"," UTC");
            Date datePar = SIMPLE_DATE_FORMAT.parse(param);
            String createtime = SDF.format(datePar);
            result.put("createtime",createtime);
            logger.info("处理完成");
            response.setCharacterEncoding("utf-8");
            response.setContentType("application/json; charset=utf-8");
            logger.info("AJAX返回数据信息");
            response.getWriter().write(com.alibaba.fastjson.JSONObject.toJSONString(result));
        }
    }
}
