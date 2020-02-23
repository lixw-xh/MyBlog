package com.blog.lxw.config;

import lombok.Data;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.TransportAddress;
import org.elasticsearch.transport.client.PreBuiltTransportClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.net.InetAddress;
import java.net.UnknownHostException;


/**
 * @author Lixw
 * @date 2020/2/23
 * ElasticSearch配置
 */
@Configuration
public class ElasticSearchConfig {

    private TransportClient client;

    @Bean
    public TransportClient client() throws UnknownHostException {
        Settings settings = Settings.builder().put("cluster.name", "bigdata").build();
        client = new PreBuiltTransportClient(settings);
        //第一个节点
        client.addTransportAddresses(new TransportAddress(InetAddress.getByName("127.0.0.1"),9300));
        //第二个节点
        client.addTransportAddresses(new TransportAddress(InetAddress.getByName("127.0.0.1"),9301));
        //第三个节点
        client.addTransportAddresses(new TransportAddress(InetAddress.getByName("127.0.0.1"),9302));
        return client;
    }
}
