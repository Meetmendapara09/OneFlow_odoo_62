package com.example.oneflow.config;

import com.example.oneflow.model.Project;
import com.example.oneflow.model.Task;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import java.io.IOException;

@Configuration
public class JacksonConfig {

    @Bean
    public Jackson2ObjectMapperBuilder jacksonBuilder() {
        Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder();

        SimpleModule module = new SimpleModule();
        module.addSerializer(Project.class, new ProjectSerializer());
        module.addSerializer(Task.class, new TaskSerializer());

        builder.modules(module);
        return builder;
    }

    // Custom serializer for Project to convert Long ID to String format
    private static class ProjectSerializer extends JsonSerializer<Project> {
        @Override
        public void serialize(Project project, JsonGenerator gen, SerializerProvider serializers) throws IOException {
            gen.writeStartObject();
            gen.writeStringField("id", project.getId() != null ? "p" + project.getId() : null);
            gen.writeStringField("name", project.getName());
            gen.writeStringField("description", project.getDescription());
            gen.writeStringField("manager", project.getManager());
            gen.writeStringField("status", project.getStatus());
            gen.writeNumberField("progress", project.getProgress());
            gen.writeStringField("deadline", project.getDeadline());
            if (project.getTeamSize() != null) {
                gen.writeNumberField("teamSize", project.getTeamSize());
            }
            if (project.getTasksCompleted() != null) {
                gen.writeNumberField("tasksCompleted", project.getTasksCompleted());
            }
            if (project.getTotalTasks() != null) {
                gen.writeNumberField("totalTasks", project.getTotalTasks());
            }
            gen.writeEndObject();
        }
    }

    // Custom serializer for Task to convert Long IDs to String format
    private static class TaskSerializer extends JsonSerializer<Task> {
        @Override
        public void serialize(Task task, JsonGenerator gen, SerializerProvider serializers) throws IOException {
            gen.writeStartObject();
            gen.writeStringField("id", task.getId() != null ? "t" + task.getId() : null);
            gen.writeStringField("title", task.getTitle());
            gen.writeStringField("description", task.getDescription());
            gen.writeStringField("project", task.getProject());
            gen.writeStringField("projectId", task.getProjectId() != null ? "p" + task.getProjectId() : null);
            gen.writeStringField("assignee", task.getAssignee());
            if (task.getAssigneeAvatar() != null) {
                gen.writeStringField("assigneeAvatar", task.getAssigneeAvatar());
            }
            gen.writeStringField("due", task.getDue());
            gen.writeStringField("priority", task.getPriority());
            gen.writeStringField("state", task.getState());
            gen.writeObjectField("tags", task.getTags());
            if (task.getSubtaskProgress() != null) {
                gen.writeObjectFieldStart("subtaskProgress");
                gen.writeNumberField("completed", task.getSubtaskProgress().getCompleted());
                gen.writeNumberField("total", task.getSubtaskProgress().getTotal());
                gen.writeEndObject();
            }
            gen.writeEndObject();
        }
    }
}

