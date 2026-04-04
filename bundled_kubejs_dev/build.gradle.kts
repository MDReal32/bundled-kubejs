plugins {
    id("java-library")
    id("maven-publish")
    id("net.neoforged.moddev") version "2.0.141"
    id("idea")
    kotlin("jvm") version "2.0.21"
}

val modId: String by project
val modVersion: String by project
val modGroupId: String by project

project.version = modVersion
project.group = modGroupId

base {
    archivesName.set(modId)
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}

neoForge {
    version = project.property("neoVersion") as String

    runs {
        create("client") {
            client()
        }
        create("server") {
            server()
            programArgument("--nogui")
        }
    }

    mods {
        create(modId) {
            sourceSet(sourceSets.main.get())
        }
    }
}

repositories {
    maven {
        name = "Kotlin for Forge"
        url = uri("https://thedarkcolour.github.io/KotlinForForge/")
    }
}

dependencies {
    implementation("thedarkcolour:kotlinforforge-neoforge:${project.property("kffVersion")}")
}

tasks.withType<ProcessResources>().configureEach {
    val props = mapOf(
        "minecraft_version" to project.property("minecraftVersion"),
        "mod_id" to modId,
        "mod_version" to modVersion,
        "neo_version_range" to project.property("neoVersionRange"),
        "loader_version_range" to project.property("loaderVersionRange"),
        "kff_version_range" to project.property("kffVersionRange")
    )
    inputs.properties(props)
    filesMatching("META-INF/neoforge.mods.toml") {
        expand(props)
    }
}

tasks.withType<JavaCompile>().configureEach {
    options.encoding = "UTF-8"
}

idea {
    module {
        isDownloadSources = true
        isDownloadJavadoc = true
    }
}
